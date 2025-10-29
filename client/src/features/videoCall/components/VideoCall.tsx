import { useEffect, useRef, useState } from 'react';
import { useVideoCall } from '@/hooks/useVideoCall';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { UserRoleType } from '@/constants/types/User';
import { userFrontendRoutes } from '@/constants/frontendRoutes/userFrontendRoutes';
import { logger } from '@/lib/utils/logger';
import { generalMessages } from '@/messages/GeneralMessages';

export default function VideoCall({
  token,
  consultationId,
  role,
}: {
  token: string;
  consultationId: string;
  role: UserRoleType;
}) {
  const { localVideoRef, remoteStreams, joined, join, leave, toggleCamera, toggleMute, localStreamRef } = useVideoCall(
    token,
    consultationId
  );
  const [hasJoinedOnce, setHasJoinedOnce] = useState(false);
  // const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const navigate = useNavigate();
  
  //Log remote stream info once per change (for debugging)
  useEffect(() => {
    if (remoteStreams.length > 0 && import.meta.env.DEV) {
      remoteStreams.forEach(r => {
        logger.debug('Remote stream added', {
          name: r.name,
          tracks: r.stream.getTracks().map(t => ({
            kind: t.kind,
            enabled: t.enabled,
            readyState: t.readyState,
            muted: t.muted,
          })),
        });
      });
    }
  }, [remoteStreams]);

  useEffect(() => {
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
      localVideoRef.current.play().catch(err => logger.warn('Local video play prevented:', err));
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
      logger.info('User left video call', { consultationId, role });
    } catch (error) {
      logger.error('Error leaving video call', error);
      toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
    } finally {
      navigate(userFrontendRoutes.consultationDetailPageAfterVideoCall(role, consultationId));
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white flex flex-col">
      {/* ---- Main Content ---- */}
      <div className="flex-1 p-4 sm:p-6 flex items-center justify-center">
        {joined ? (
          // ---- Video Grid ----
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl w-full">
            {/* Local Video */}
            <div className="relative group rounded-xl overflow-hidden shadow-2xl bg-black">
              <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full z-10 flex items-center gap-1.5 backdrop-blur-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                You
              </div>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-72 sm:h-96 object-cover transform scale-x-[-1]"
                onLoadedMetadata={() => {
                  if (localVideoRef.current) {
                    localVideoRef.current.play().catch(err =>
                      logger.warn('Local video play prevented:', err)
                    );
                  }
                }}
              />
            </div>

            {/* Remote Video */}
            <div className="relative group rounded-xl overflow-hidden shadow-2xl bg-black">
              {remoteStreams.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-72 sm:h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl">
                  <div className="w-16 h-16 rounded-full bg-gray-700 border-4 border-dashed border-gray-600 mb-4"></div>
                  <p className="text-gray-400 text-lg">Waiting for participant...</p>
                </div>
              ) : (
                remoteStreams.map(remote => (
                  <RemoteVideo
                    key={remote.id}
                    stream={remote.stream}
                    name={remote.name}
                  />
                ))
              )}
            </div>
          </div>
        ) : hasJoinedOnce ? (
          // ---- Left Call Screen ----
          <div className="flex flex-col items-center justify-center space-y-8 text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold">You left the call</h2>
            <p className="text-gray-400">Rejoin or return to consultation details</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleJoin}
                className="px-5 py-2.5 bg-green-500 hover:bg-green-600 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                Rejoin
              </button>
              <button
                onClick={() =>
                  navigate(
                    userFrontendRoutes.consultationDetailPageAfterVideoCall(
                      role,
                      consultationId
                    )
                  )
                }
                className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-all duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        ) : (
          // ---- Pre-Join Screen ----
          <div className="flex flex-col items-center justify-center space-y-8 text-center max-w-md">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1.5">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold">Ready to join the call?</h2>
            <p className="text-gray-400">
              Make sure your camera and microphone are ready
            </p>
            <button
              onClick={handleJoin}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              Join Now
            </button>
          </div>
        )}
      </div>

      {/* ---- Floating Toolbar (bottom center) ---- */}
      {joined && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800/90 backdrop-blur-md px-5 sm:px-6 py-3 rounded-full shadow-lg flex items-center justify-center gap-3 sm:gap-5 border border-gray-700">
          {/* Mute Button */}
          <button
            onClick={() => setIsMuted(toggleMute())}
            className={`p-3 rounded-full transition-all duration-200 flex items-center justify-center ${
              isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fff" viewBox="0 0 24 24">
                <path d="M19 11c0 1.93-.78 3.68-2.05 4.95l1.49 1.49A7.93 7.93 0 0021 11zM4.27 3L3 4.27l6.01 6.01V11a3 3 0 004.24 2.83l1.45 1.45A4.96 4.96 0 0112 17a5 5 0 01-5-5H5a7 7 0 0011.19 5.44l3.39 3.39 1.27-1.27zM12 3a3 3 0 013 3v3.18l2 2V6a5 5 0 00-8.45-3.54l1.42 1.42A2.99 2.99 0 0112 3z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#fff" viewBox="0 0 14 14">
                <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.5 6.5a2.5 2.5 0 0 1-5 0V3a2.5 2.5 0 0 1 5 0Z" />
                  <path d="M12 7h0a4.49 4.49 0 0 1-4.5 4.5h-1A4.49 4.49 0 0 1 2 7h0m5 4.5v2" />
                </g>
              </svg>
            )}
          </button>

          {/* Camera Button */}
          <button
            onClick={() => setIsCameraOn(toggleCamera())}
            className={`p-3 rounded-full transition-all duration-200 flex items-center justify-center ${
              !isCameraOn ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
          >
            {isCameraOn ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#fff" viewBox="0 0 24 24">
                <path d="M18 7c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-3.333L22 17V7l-4 3.333V7z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="#ffffff" d="M3.28 2.22a.75.75 0 1 0-1.06 1.06l1.567 1.567A3.25 3.25 0 0 0 2 7.75v8.5a3.25 3.25 0 0 0 3.25 3.25h7.5a3.251 3.251 0 0 0 3.168-2.521l4.801 4.802a.75.75 0 0 0 1.061-1.061L3.28 2.22ZM17 13.818l4.504 4.505a1 1 0 0 0 .496-.864V6.54a1 1 0 0 0-1.648-.762L17 8.628v5.19ZM7.682 4.5L16 12.818V7.75a3.25 3.25 0 0 0-3.25-3.25H7.682Z"/></svg>
            )}
          </button>

          {/* End Call Button */}
          <button
            onClick={handleLeave}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-200 flex items-center justify-center"
            title="Leave Call"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round">
              <path d="M12 8.25c2.517 0 5 .555 7.3 1.621c1.252.581 1.95 1.895 1.95 3.276V14a1.75 1.75 0 0 1-1.75 1.75h-2A1.75 1.75 0 0 1 15.75 14v-.492a1.5 1.5 0 0 0-1.5-1.5h-4.5a1.5 1.5 0 0 0-1.5 1.5V14a1.75 1.75 0 0 1-1.75 1.75h-2A1.75 1.75 0 0 1 2.75 14v-.853c0-1.38.698-2.695 1.95-3.276A17.3 17.3 0 0 1 12 8.25Z" />
            </svg>
          </button>
        </div>
      )}

      {/* ---- Status Bar ---- */}
      {joined && (
        <div className="absolute top-0 left-0 right-0 p-2 sm:p-3 text-xs sm:text-sm flex justify-between items-center bg-gray-800/70 backdrop-blur-sm border-b border-gray-700">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Connected
            </span>
            <span className="hidden sm:inline text-gray-400">•</span>
            <span className="hidden sm:inline">
              {remoteStreams.length + 1} participant
              {remoteStreams.length + 1 > 1 ? 's' : ''}
            </span>
          </div>
          <span className="text-gray-400 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1C8.48 1 5.28 2.55 3.06 5.06c-.46.51-.06 1.3.68 1.3h2.54c.58 0 1.05-.47 1.05-1.05 0-.38-.21-.72-.53-.9C7.82 3.55 9.86 3 12 3c4.96 0 9 4.04 9 9s-4.04 9-9 9c-2.14 0-4.18-.75-5.82-2.11-.32-.27-.79-.24-1.1.08-.31.32-.34.79-.08 1.1C7.24 22.45 9.58 23 12 23c6.07 0 11-4.93 11-11S18.07 1 12 1z" />
            </svg>
            Secure call
          </span>
        </div>
      )}
    </div>
  );

}

function RemoteVideo({ stream, name }: { stream: MediaStream; name: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (video.srcObject !== stream) {
      video.srcObject = stream;
      video.play().catch(err => {
        logger.warn('Video play prevented:', err);
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
