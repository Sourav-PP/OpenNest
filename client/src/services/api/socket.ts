import type { IChatError } from '@/types/api/chat';
import type { IMessageDto } from '@/types/dtos/message';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
const messageHandlers: ((msg: IMessageDto) => void)[] = [];
const errorListeners: ((err: IChatError) => void)[] = [];


// Connect to the socket server
export function connectSocket(token: string) {
  if (socket) {
    if (socket.connected) {
      console.log('Reusing existing connected socket:', socket.id);
    } else {
      console.log('Reusing existing socket (not connected), will auto-reconnect:', socket.id);
    }
    return socket;
  }

  console.log('Creating new socket instance with token:', token);
  socket = io('http://localhost:5006', {
    transports: ['websocket'],
    withCredentials: true,
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('Connected to socket server:', socket!.id);
  });

  socket.on('disconnect', reason => {
    console.log('Disconnected from socket server:', reason);
  });

  socket.on('connect_error', err => {
    console.error('Connection failed:', err.message);
  });

  socket.on('new_message', msg => {
    messageHandlers.slice().forEach(cb => cb(msg));
  });

  socket.on('chat_error', err => {
    errorListeners.slice().forEach(cb => cb(err));
  });

  return socket;
}

// Disconnect the socket and clean up listeners
export function disconnectSocket() {
  if (socket) {
    console.log('Disconnecting socket:', socket.id);
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


export const joinConsultation = (consultationId: string) => {
  const socket = getSocket();
  if (!socket) throw new Error('Socket not connected');

  return new Promise<void>((resolve, reject) => {
    const join = () =>
      socket.emit(
        'join_consultation',
        consultationId,
        (res: { success: boolean; roomId?: string; error?: string }) => {
          if (res.success) resolve();
          else reject(new Error(res.error || 'Failed to join'));
        }
      );

    if(socket.connected) {
      join();
    }else{
      socket.once('connect', join);
    }
  });
};

//sending message
export const sendMessage = (data: {
  consultationId: string;
  senderId: string;
  receiverId: string;
  content?: string;
  mediaUrl?: string;
}) => {
  const socket = getSocket();
  if (!socket || !socket.connected) {
    console.warn('Socket not connected yet, cannot send message');
    return;
  }
  socket.emit('send_message', data);
};
