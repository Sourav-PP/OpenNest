import { Server, Socket } from 'socket.io';

export interface IVideoCallSocketHandler {
    register(io: Server, socket: Socket): void;
}
