import { useEffect, useRef, useState } from 'react';
import {
  connectVideoSocket,
  disconnectVideoSocket,
  joinCall,
  leaveCall,
  sendOffer,
  sendAnswer,
  sendIceCandidate,
  onUserJoined,
  onUserLeft,
  onOffer,
  onAnswer,
  onIceCandidate,
  onCurrentParticipants,
} from '../services/api/videoSocket';
import { toast } from 'react-toastify';
import { logger } from '@/lib/utils/logger';

const ICE_SERVERS: RTCConfiguration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

export function useVideoCall(token: string, consultationId: string) {
  const [joined, setJoined] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState<{ id: string; stream: MediaStream; name: string }[]>([]);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<Record<string, RTCPeerConnection>>({});
  const peersNameRef = useRef<Record<string, string>>({});
  const pendingTargetsRef = useRef<Set<string>>(new Set());
  const socketRef = useRef<any>(null);
  const candidateBufferRef = useRef<Record<string, RTCIceCandidateInit[]>>({});

  const addOrReplaceRemoteStream = (socketId: string, stream: MediaStream, name: string) => {
    setRemoteStreams(prev => {
      const filtered = prev.filter(r => r.id !== socketId);
      return [...filtered, { id: socketId, stream, name }];
    });
  };

  const drainCandidateBuffer = async (socketId: string) => {
    const buf = candidateBufferRef.current[socketId];
    if (!buf || buf.length === 0) return;
    const pc = peersRef.current[socketId];
    if (!pc) return;
    for (const c of buf) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(c));
        logger.debug(`Added buffered ICE candidate for ${socketId}`);
      } catch (err) {
        logger.error(`Failed adding buffered ICE candidate for ${socketId}`, err);
      }
    }
    candidateBufferRef.current[socketId] = [];
  };

  const getOrCreatePeer = (socketId: string) => {
    if (peersRef.current[socketId]) return peersRef.current[socketId];

    const pc = new RTCPeerConnection(ICE_SERVERS);

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current!));
    }

    pc.ontrack = event => {
      if (event.streams && event.streams[0]) {
        const name = peersNameRef.current[socketId] || 'participant';
        addOrReplaceRemoteStream(socketId, event.streams[0], name);
        logger.info(`Received remote stream from ${name} (${socketId})`);
      }
    };

    pc.onicecandidate = event => {
      if (event.candidate) {
        sendIceCandidate(socketId, event.candidate);
      }
    };

    pc.oniceconnectionstatechange = () => {
      logger.debug(`ICE state changed for ${socketId}: ${pc.iceConnectionState}`);
    };

    peersRef.current[socketId] = pc;
    return pc;
  };

  const createOfferPeer = async (socketId: string) => {
    const pc = getOrCreatePeer(socketId);

    if (pc.signalingState === 'have-local-offer') {
      return;
    }

    if (!localStreamRef.current) {
      pendingTargetsRef.current.add(socketId);
      logger.debug(`Local stream not ready. Queued offer for ${socketId}`);
      return;
    }

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      sendOffer(socketId, offer);
      logger.info(`Offer sent to ${socketId}`);
    } catch (err) {
      logger.error(`Error creating offer for ${socketId}`, err);
    }
  };

  useEffect(() => {
    socketRef.current = connectVideoSocket(token);

    const handleCurrentParticipants = (participants: { socketId: string; name: string }[]) => {
      logger.info(`Existing participants: ${participants}`);

      participants.forEach(p => {
        peersNameRef.current[p.socketId] = p.name;
        if (localStreamRef.current) {
          createOfferPeer(p.socketId);
        } else {
          pendingTargetsRef.current.add(p.socketId);
        }
      });
    };

    const handleUserJoined = (data: { socketId: string; name: string }) => {
      peersNameRef.current[data.socketId] = data.name;
      logger.info(`${data.name} joined the call`);
    };

    const handleUserLeft = (data: { socketId: string }) => {
      if (peersRef.current[data.socketId]) {
        peersRef.current[data.socketId].close();
        delete peersRef.current[data.socketId];
      }
      setRemoteStreams(prev => prev.filter(r => r.id !== data.socketId));
      toast.info('Participant has left the call');
      delete peersNameRef.current[data.socketId];
      // clear candidate buffer
      delete candidateBufferRef.current[data.socketId];
      // remove from pending
      pendingTargetsRef.current.delete(data.socketId);
    };

    const handleOffer = async ({ offer, from }: { offer: RTCSessionDescriptionInit; from: string }) => {
      const pc = getOrCreatePeer(from);

      if (pc.signalingState !== 'stable') return;

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        await drainCandidateBuffer(from);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sendAnswer(from, answer);
        logger.info(`Processed and answered offer from ${from}`);
      } catch (err) {
        logger.error(`Failed handling offer from ${from}`, err);
      }
    };

    const handleAnswer = async ({ answer, from }: { answer: RTCSessionDescriptionInit; from: string }) => {
      const pc = peersRef.current[from];
      if (!pc) return;

      if (pc.signalingState === 'have-local-offer') {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          await drainCandidateBuffer(from);
          logger.debug(`Set remote description from ${from}`);
        } catch (err) {
          logger.error(`Failed setting remote description from ${from}`, err);
        }
      } else {
        logger.warn('[onAnswer] unexpected signalingState for', from, pc.signalingState);
      }
    };


    const handleIce = async ({ candidate, from }: { candidate: RTCIceCandidateInit; from: string }) => {
      const pc = peersRef.current[from];
      if (!pc) {
        // buffer it so when pc is created later we can add
        candidateBufferRef.current[from] = candidateBufferRef.current[from] || [];
        candidateBufferRef.current[from].push(candidate);
        logger.debug(`Buffered ICE candidate from ${from}`);
        return;
      }

      // if remote description not yet set, buffer
      if (!pc.remoteDescription || (pc.remoteDescription && (pc.remoteDescription as any).type === null)) {
        candidateBufferRef.current[from] = candidateBufferRef.current[from] || [];
        candidateBufferRef.current[from].push(candidate);
        return;
      }

      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
        logger.debug(`Added ICE candidate from ${from}`);
      } catch (err) {
        logger.error(`Failed adding ICE candidate from ${from}`, err);
      }
    };

    onCurrentParticipants(handleCurrentParticipants);
    onUserJoined(handleUserJoined);
    onUserLeft(handleUserLeft);
    onOffer(handleOffer);
    onAnswer(handleAnswer);
    onIceCandidate(handleIce);

    // cleanup function
    return () => {
      try {
        const sock = socketRef.current;
        if (sock) {
          sock.off('current_participants');
          sock.off('user_joined');
          sock.off('user_left');
          sock.off('offer');
          sock.off('answer');
          sock.off('ice_candidate');
        }
      } finally {
        disconnectVideoSocket();
      }
    };
  }, [token, consultationId]);

  const join = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(err => logger.warn('Local video play prevented:', err));
      }

      // attach tracks to any already-created peer connections
      Object.values(peersRef.current).forEach(pc => {
        try {
          stream.getTracks().forEach(track => pc.addTrack(track, stream));
        } catch (e) {
          logger.error('error adding track to existing pc', e);
        }
      });

      // if there were pending targets, attempt offers now
      if (pendingTargetsRef.current.size > 0) {
        Array.from(pendingTargetsRef.current).forEach(targetId => {
          createOfferPeer(targetId);
          pendingTargetsRef.current.delete(targetId);
        });
      }

      joinCall(consultationId);
      setJoined(true);
    } catch (err) {
      logger.error('Failed to access camera/mic:', err);
      throw err;
    }
  };

  const toggleMute = () => {
    if (!localStreamRef.current) return false;
    const enabled = !localStreamRef.current.getAudioTracks()[0]?.enabled;
    localStreamRef.current.getAudioTracks().forEach(track => (track.enabled = enabled));
    return enabled;
  };

  const toggleCamera = () => {
    if (!localStreamRef.current) return false;
    const enabled = !localStreamRef.current.getVideoTracks()[0]?.enabled;
    localStreamRef.current.getVideoTracks().forEach(track => (track.enabled = enabled));
    return enabled;
  };

  const leave = () => {
    leaveCall(consultationId);
    Object.values(peersRef.current).forEach(pc => pc.close());
    peersRef.current = {};
    setRemoteStreams([]);
    setJoined(false);

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
    }
  };

  return { localVideoRef, remoteStreams, joined, join, leave, toggleMute, toggleCamera, localStreamRef };
}
