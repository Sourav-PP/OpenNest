export interface VideoCall {
  id: string;
  consultationId: string;
  patientId: string;
  psychologistId: string;
  callUrl: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'canceled' | 'missed';
  startedAt: Date | null;
  endedAt: Date | null;
  duration?: number; 
  recordingUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}