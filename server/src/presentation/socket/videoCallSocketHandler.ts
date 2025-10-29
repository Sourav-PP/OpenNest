import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { IUserRepository } from '@/domain/repositoryInterface/IUserRepository';
import { IVideoCallRepository } from '@/domain/repositoryInterface/IVideoCallRepository';
import { bookingMessages } from '@/shared/constants/messages/bookingMessages';
import { videoCallMessages } from '@/shared/constants/messages/videoCallMessages';
import { IEndVideoCallUseCase } from '@/useCases/interfaces/videoCall/IEndVideoCallUseCase';
import { IStartVideoCallUseCase } from '@/useCases/interfaces/videoCall/IStartVideoCallUseCase';
import { IVideoCallSocketHandler } from '@/useCases/interfaces/videoCall/IVideoCallSocketHandler';
import logger from '@/utils/logger';
import { Server, Socket } from 'socket.io';

export class VideoCallSocketHandler implements IVideoCallSocketHandler {
    private _startVideoCallUseCase: IStartVideoCallUseCase;
    private _endVideoCallUseCase: IEndVideoCallUseCase;
    private _consultationRepo: IConsultationRepository;
    private _videoCallRepo: IVideoCallRepository;
    private _psychologistRepo: IPsychologistRepository;
    private _userRepo: IUserRepository;

    constructor(
        startVideoCallUseCase: IStartVideoCallUseCase,
        endVideCallUseCase: IEndVideoCallUseCase,
        consultationRepo: IConsultationRepository,
        videoCallRepo: IVideoCallRepository,
        psychologistRepo: IPsychologistRepository,
        userRepo: IUserRepository,
    ) {
        this._startVideoCallUseCase = startVideoCallUseCase;
        this._endVideoCallUseCase = endVideCallUseCase;
        this._consultationRepo = consultationRepo;
        this._videoCallRepo = videoCallRepo;
        this._psychologistRepo = psychologistRepo;
        this._userRepo = userRepo;
    }

    register(io: Server, socket: Socket) {
        socket.on('join_call', async({ consultationId }) => {
            const userId = socket.data.userId;
            const consultation = await this._consultationRepo.findById(consultationId);

            if (!consultation) {
                socket.emit('error', { message: bookingMessages.ERROR.CONSULTATION_NOT_FOUND });
                return;
            }

            const now = new Date(consultation.startDateTime);
            const start = new Date(consultation.endDateTime);
            const end = new Date(consultation.endDateTime);

            if (now.getTime() < start.getTime() - 5 * 60 * 1000) {
                socket.emit('error', { message: videoCallMessages.ERROR.SESSION_NOT_STARTED });
                return;
            }

            if (now.getTime() > end.getTime() + 10 * 60 * 1000) {
                socket.emit('error', { message: videoCallMessages.ERROR.SESSION_ENDED });
                return;
            }

            let isAuthorized = consultation.patientId === userId;

            if (!isAuthorized) {
                const psychologist = await this._psychologistRepo.findByUserId(userId);
                if (psychologist && consultation.psychologistId === psychologist.id) {
                    isAuthorized = true;
                }
            }

            if (!isAuthorized) {
                socket.emit('error', { message: videoCallMessages.ERROR.UNAUTHORIZED });
                return;
            }

            const room = `video_${consultationId}`;

            const user = await this._userRepo.findById(userId);

            socket.join(room);

            const otherSockets = Array.from(await io.in(room).allSockets()).filter(id => id !== socket.id);

            const participants = [];
            for (const id of otherSockets) {
                const s = io.sockets.sockets.get(id);
                if (s) participants.push({ socketId: id, name: s.data?.name || 'participant' } );
            }

            socket.emit('current_participants', participants);

            socket.to(room).emit('user_joined', { userId, socketId: socket.id, name: user?.name });

            const call = await this._videoCallRepo.findByConsultationId(consultationId);

            if (call?.status === 'scheduled') {
                await this._startVideoCallUseCase.execute(consultationId);
            }

            logger.info(`User ${userId} joined video room ${room}`);
        });

        socket.on('offer', ({ to, offer }) => io.to(to).emit('offer', { offer, from: socket.id }));
        socket.on('answer', ({ to, answer }) => io.to(to).emit('answer', { answer, from: socket.id }));
        socket.on('ice_candidate', ({ to, candidate }) =>
            io.to(to).emit('ice_candidate', { candidate, from: socket.id }),
        );

        socket.on('leave_call', async({ consultationId }) => {
            const room = `video_${consultationId}`;
            const userId = socket.data.userId;

            socket.leave(room);
            socket.to(room).emit('user_left', { userId, socketId: socket.id });

            // Check if the room still has participants
            const remaining = (await io.in(room).allSockets()).size;

            if (remaining === 0) {
                // Only mark as ended if no one is left in the call
                await this._endVideoCallUseCase.execute(consultationId);
            }

            logger.info(`User ${userId} left video room ${room}`);
        });

        socket.on('disconnect', () => {
            io.emit('user_offline', { userId: socket.data.userId });
        });
    }
}
