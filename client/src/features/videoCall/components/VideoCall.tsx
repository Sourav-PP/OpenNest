import { useEffect, useRef, useState } from 'react';
import { useVideoCall } from '@/hooks/useVideoCall';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function VideoCall({
  token,
  consultationId,
  role
}: {
  token: string;
  consultationId: string;
  role: 'user' | 'psychologist' | 'admin' | null
}) {
  const { localVideoRef, remoteStreams, joined, join, leave, toggleCamera, toggleMute, localStreamRef } = useVideoCall(token, consultationId);
  const [hasJoinedOnce, setHasJoinedOnce] = useState(false);
  // const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const navigate = useNavigate();
  console.log('remoteStrem: ', remoteStreams);
  console.log('localVideoRef: ', localVideoRef);

  useEffect(() => {
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
      localVideoRef.current.play().catch(err => console.warn('Local video play prevented:', err));
    }
  }, [joined]);

  const handleJoin = async () => {
    await join();
    setHasJoinedOnce(true);

    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      setIsCameraOn(videoTrack?.enabled ?? false);
    }
  };

  const handleLeave = async () => {
    try {
      await leave();
    } catch (error) {
      console.log('error leaving call: ', error);
      toast.error('error leaving call');
    } finally {
      navigate(`/${role}/consultations/${consultationId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Toolbar */}
      <div className="bg-gray-800 p-4 flex justify-center items-center shadow-md">
        <div className="flex gap-4">
          {!joined ? (
            <button
              onClick={handleJoin}
              className="px-4 py-2 rounded-lg font-medium bg-green-500 hover:bg-green-600 transition-colors duration-200"
            >
              Join Call
            </button>
          ) : (
            <button
              onClick={handleLeave}
              className="px-4 py-2 rounded-lg font-medium bg-red-500 hover:bg-red-600 transition-colors duration-200"
            >
              Leave Call
            </button>
          )}

          {joined && (
            <button
              onClick={() => setIsMuted(toggleMute())}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                isMuted ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-700 hover:bg-gray-800'
              }`}
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
          )}

          {/* Camera On/Off */}
          {joined && (
            <button
              onClick={() => setIsCameraOn(toggleCamera())}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                !isCameraOn ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-700 hover:bg-gray-800'
              }`}
            >
              {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex items-center justify-center">
        {joined ? (
          // ---- Video Grid ----
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl w-full">
            {/* Local Video */}
            <div className="relative group">
              <div className="absolute top-0 left-0 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded-tl-md">
                You
              </div>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-96 rounded-lg shadow-lg object-cover group-hover:ring-2 group-hover:ring-blue-500 transition-all duration-200"
                onLoadedMetadata={() => {
                  if (localVideoRef.current) {
                    localVideoRef.current.play().catch(err => console.warn('Local video play prevented:', err));
                  }
                }}
              />
            </div>

            {/* Remote Video */}
            <div className="relative group">
              {remoteStreams.length === 0 ? (
                <div className="flex items-center justify-center h-96 bg-gray-800 rounded-lg">
                  <p className="text-gray-400 text-lg">Waiting for participant...</p>
                </div>
              ) : (
                remoteStreams.map((remote) => (
                  <RemoteVideo key={remote.id} stream={remote.stream} name={remote.name} />
                ))
              )}
            </div>
          </div>
        ) : hasJoinedOnce ? (
          // ---- Left Call Screen ----
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <h2 className="text-2xl font-semibold">You left the call</h2>
            <div className="flex gap-4">
              <button
                onClick={handleJoin}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-medium transition-colors duration-200"
              >
                Rejoin
              </button>
              <button
                onClick={() => navigate(`/${role}/consultations/${consultationId}`)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        ): (
          // ---- Before joining for the first time ----
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <h2 className="text-2xl font-semibold">Ready to join the call?</h2>
            <button
              onClick={handleJoin}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-medium transition-colors duration-200"
            >
              Join Now
            </button>
          </div>
        )}
      </div>

      {/* Status Bar */}
      {joined && (
        <div className="bg-gray-800 p-3 text-sm flex justify-between items-center">
          <span>Participants: {remoteStreams.length + 1}</span>
          {/* <span>Consultation ID: {consultationId}</span> */}
        </div>
      )}
    </div>
  );
}

function RemoteVideo({ stream, name }: { stream: MediaStream, name: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (video.srcObject !== stream) {
      video.srcObject = stream;
      video.play().catch(err => {
        console.warn('Video play prevented:', err);
      });
    }
  }, [stream]);

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded-tl-md">
        {name}
      </div>
      <video
        ref={ref}
        autoPlay
        playsInline
        className="w-full h-96 rounded-lg shadow-lg object-cover group-hover:ring-2 group-hover:ring-blue-500 transition-all duration-200"
      />
    </div>
  );
}
