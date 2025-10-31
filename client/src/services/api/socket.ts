import { logger } from '@/lib/utils/logger';
import type { IChatError } from '@/types/api/chat';
import type { IMessageDto } from '@/types/dtos/message';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
const messageHandlers: ((msg: IMessageDto) => void)[] = [];
const deleteHandler: ((data: {
  messageId: string;
  roomId: string;
  deletedBy: string;
  isDeleted: boolean;
}) => void)[] = [];
const errorListeners: ((err: IChatError) => void)[] = [];
const typingHandlers: ((data: { roomId: string; senderId: string }) => void)[] = [];

const onlineListeners: ((users: Set<string>) => void)[] = [];
const onlineUsers: Set<string> = new Set();

// Connect to the socket server
export function connectSocket(token: string) {
  if (socket) {
    if (socket.connected) {
      logger.info(`Reusing existing connected socket: ${socket.id}`);
    } else {
      logger.debug(`Reusing existing socket (not connected), will auto-reconnect: ${socket.id}`);
    }
    return socket;
  }

  socket = io(import.meta.env.VITE_BACKEND_URL, {
    transports: ['websocket'],
    withCredentials: true,
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    logger.info(`Connected to socket: ${socket!.id}`);
    // Fetch initial online users
    socket!.emit('get_online_users', (users: string[]) => {
      users.forEach(u => onlineUsers.add(u));
      onlineListeners.forEach(cb => cb(new Set(onlineUsers)));
    });
  });

  socket.on('disconnect', reason => {
    logger.warn('Socket disconnected, reason =', reason);
  });

  socket.on('connect_error', err => {
    logger.error('Socket connection error', err);
  });

  socket.on('new_message', msg => {
    messageHandlers.slice().forEach(cb => cb(msg));
  });

  socket.on(
    'message_deleted',
    (data: { messageId: string; roomId: string; deletedBy: string; isDeleted: boolean }) => {
      deleteHandler.slice().forEach(cb => cb(data));
    }
  );

  socket.on('chat_error', err => {
    errorListeners.slice().forEach(cb => cb(err));
  });

  socket.on('typing', data => typingHandlers.slice().forEach(cb => cb(data)));
  socket.on('stop_typing', data => typingHandlers.slice().forEach(cb => cb(data)));

  // Online/offline events
  socket.on('user_online', ({ userId }: { userId: string }) => {
    onlineUsers.add(userId);
    onlineListeners.slice().forEach(cb => cb(new Set(onlineUsers)));
  });
  socket.on('user_offline', ({ userId }: { userId: string }) => {
    onlineUsers.delete(userId);
    onlineListeners.slice().forEach(cb => cb(new Set(onlineUsers)));
  });

  return socket;
}

// Disconnect the socket and clean up listeners
export function disconnectSocket() {
  if (socket) {
    socket.off();
    socket.disconnect();
    socket = null;
    messageHandlers.length = 0;
    errorListeners.length = 0;
  }
}

// Get current socket instance
export function getSocket() {
  return socket;
}

// Register a message listener
export function onMessage(cb: (msg: IMessageDto) => void) {
  if (!messageHandlers.includes(cb)) {
    messageHandlers.push(cb);
  }
  return () => {
    const index = messageHandlers.indexOf(cb);
    if (index !== -1) messageHandlers.splice(index, 1);
  };
}

export function onTyping(cb: (data: { roomId: string; senderId: string }) => void) {
  if (!typingHandlers.includes(cb)) typingHandlers.push(cb);
  return () => {
    const index = typingHandlers.indexOf(cb);
    if (index !== -1) typingHandlers.splice(index, 1);
  };
}

export function onMessageDelete(
  cb: (data: { messageId: string; roomId: string; deletedBy: string; isDeleted: boolean }) => void
) {
  if (!deleteHandler.includes(cb)) {
    deleteHandler.push(cb);
  }
  return () => {
    const index = deleteHandler.indexOf(cb);
    if (index !== -1) deleteHandler.splice(index, 1);
  };
}

// Registering the error listener
export function onError(cb: (err: IChatError) => void) {
  if (!errorListeners.includes(cb)) {
    errorListeners.push(cb);
  }
  return () => {
    const index = errorListeners.indexOf(cb);
    if (index !== -1) errorListeners.splice(index, 1);
  };
}

// Online users
export function onOnlineUsers(cb: (users: Set<string>) => void) {
  if (!onlineListeners.includes(cb)) onlineListeners.push(cb);
  // immediately call back with current online users
  cb(new Set(onlineUsers));
  return () => {
    const index = onlineListeners.indexOf(cb);
    if (index !== -1) onlineListeners.splice(index, 1);
  };
}

export const joinConsultation = (roomId: string) => {
  const socket = getSocket();
  if (!socket) throw new Error('Socket not connected');

  return new Promise<void>((resolve, reject) => {
    const join = () =>
      socket.emit('join_consultation', roomId, (res: { success: boolean; roomId?: string; error?: string }) => {
        if (res.success) resolve();
        else reject(new Error(res.error || 'Failed to join'));
      });

    if (socket.connected) {
      join();
    } else {
      socket.once('connect', join);
    }
  });
};

export const deleteMessage = (data: { messageId: string; roomId: string }) => {
  const socket = getSocket();
  if (!socket || !socket.connected) {
    return;
  }
  socket.emit('delete', data);
};

// Typing events
export const emitTyping = (roomId: string) => {
  const socket = getSocket();
  if (!socket || !socket.connected) return;
  socket.emit('typing', { roomId });
};

export const emitStopTyping = (roomId: string) => {
  const socket = getSocket();
  if (!socket || !socket.connected) return;
  socket.emit('stop_typing', { roomId });
};

//sending message
export const sendMessage = (data: {
  roomId: string;
  senderId: string;
  receiverId: string;
  content?: string;
  mediaUrl?: string;
}) => {
  const socket = getSocket();
  if (!socket || !socket.connected) {
    return;
  }
  socket.emit('send_message', data);
};
