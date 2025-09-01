import { Server, Socket } from 'socket.io';

export interface IChatSocketHandler {
    register(io: Server, socket: Socket): void;
}
