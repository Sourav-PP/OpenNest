import { useParams } from 'react-router-dom';
import VideoCall from '../components/VideoCall';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';

export default function VideoCallPage() {
  const { accessToken, userId, role } = useSelector((state: RootState) => state.auth);
  const { id } = useParams<{ id: string }>();

  if (!accessToken || !userId) return <p>Unauthorized</p>;

  return <VideoCall token={accessToken} consultationId={id!} role={role} />;
}
