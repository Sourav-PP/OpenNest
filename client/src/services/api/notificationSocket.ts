import type { NotificationTypeValue } from '@/constants/types/Notification';
import { logger } from '@/lib/utils/logger';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
const notificationHandlers: ((data: {
  id: string;
  message: string;
  type: NotificationTypeValue;
  consultationId?: string;
  read: boolean;
  createdAt: Date;
  notifyAt?: Date;
}) => void)[] = [];

export function connectNotificationSocket(token: string) {
  if (socket && socket.connected) return socket;

  socket = io(import.meta.env.VITE_BACKEND_URL, {
    transports: ['websocket'],
    auth: { token },
    withCredentials: true,
  });

  socket.on('connect', () => {
    logger.info('Notification socket connected:', socket?.id);
  });

  socket.on('disconnect', reason => {
    logger.info('Notification socket disconnected:', reason);
  });

  // listen for notifications
  socket.on(
    'notification',
    (data: { id: string; message: string; type: NotificationTypeValue; consultationId?: string; read: boolean, createdAt: Date, notifyAt?: Date }) => {
      notificationHandlers.slice().forEach(cb => cb(data));
    }
  );

  return socket;
}

export function onNotification(
  cb: (data: {
    id: string;
    message: string;
    type: NotificationTypeValue;
    consultationId?: string;
    read: boolean;
    createdAt: Date;
    notifyAt?: Date;
  }) => void
) {
  if (!notificationHandlers.includes(cb)) notificationHandlers.push(cb);
  return () => {
    const index = notificationHandlers.indexOf(cb);
    if (index !== -1) notificationHandlers.splice(index, 1);
  };
}

export function disconnectNotificationSocket() {
  if (socket) {
    socket.off();
    socket.disconnect();
    socket = null;
    notificationHandlers.length = 0;
  }
}
