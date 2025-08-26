import { io } from 'socket.io-client';

export const socket = io('http://localhost:5006', {
  transports: ['websocket'],
  withCredentials: true,
});

export function joinConsultation(consultationId: string) {
  socket.emit('join_consultation', consultationId);
}

export function sendMessage(data: {
  consultationId: string;
  senderId: string;
  receiverId: string;
  content?: string;
  mediaUrl?: string;
}) {
  socket.emit('send_message', data);
}
