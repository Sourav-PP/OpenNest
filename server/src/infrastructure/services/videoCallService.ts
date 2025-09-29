import { IVideoCallService } from '@/domain/serviceInterface/IVideoCallService';

export class VideoCallService implements IVideoCallService {
    private _baseUrl: string;

    constructor(baseUrl: string) {
        this._baseUrl = baseUrl;
    }

    async generateMeetingLink(consultationId: string): Promise<string> {
        return `${this._baseUrl}/consultations/${consultationId}/join`;
    }
}
