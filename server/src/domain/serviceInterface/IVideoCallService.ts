export interface IVideoCallService {
    generateMeetingLink(consultationId: string): Promise<string>
}