import { toast } from 'react-toastify';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function connectVideoSocket(token: string) {
  if (socket && socket.connected) return socket;

  socket = io(import.meta.env.VITE_BACKEND_URL, {
    transports: ['websocket'],
    auth: { token },
  });

  socket.on('connect', () => console.log('Video socket connected', socket?.id));
  socket.on('error', (data: { message: string }) => {
    console.error('Socket error:', data.message);
    toast.error(data.message); // optional: show to user
  });
  socket.on('disconnect', reason => console.log('Video socket disconnected', reason));

  return socket;
}

export function disconnectVideoSocket() {
  if (socket) {
    socket.off();
    socket.disconnect();
    socket = null;
  }
}

export function joinCall(consultationId: string) {
  socket?.emit('join_call', { consultationId });
}

export function leaveCall(consultationId: string) {
  socket?.emit('leave_call', { consultationId });
}

export function sendOffer(to: string, offer: RTCSessionDescriptionInit) {
  socket?.emit('offer', { to, offer });
}

export function sendAnswer(to: string, answer: RTCSessionDescriptionInit) {
  socket?.emit('answer', { to, answer });
}

export function sendIceCandidate(to: string, candidate: RTCIceCandidate) {
  socket?.emit('ice_candidate', { to, candidate });
}

export function onUserJoined(cb: (data: { socketId: string; name: string }) => void) {
  socket?.on('user_joined', cb);
}

export function onUserLeft(cb: (data: { socketId: string }) => void) {
  socket?.on('user_left', cb);
}

export function onOffer(cb: (data: { offer: RTCSessionDescriptionInit; from: string }) => void) {
  socket?.on('offer', cb);
}

export function onAnswer(cb: (data: { answer: RTCSessionDescriptionInit; from: string }) => void) {
  socket?.on('answer', cb);
}

export function onIceCandidate(cb: (data: { candidate: RTCIceCandidate; from: string }) => void) {
  socket?.on('ice_candidate', cb);
}

export function onCurrentParticipants(cb: (participants: { socketId: string; name: string }[]) => void) {
  socket?.on('current_participants', cb);
}
