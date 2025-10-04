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

const ICE_SERVERS: RTCConfiguration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

export function useVideoCall(token: string, consultationId: string) {
  const [joined, setJoined] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState<{ id: string; stream: MediaStream, name: string }[]>([]);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<Record<string, RTCPeerConnection>>({});
  const peersNameRef = useRef<Record<string, string>>({});
  const pendingTargetsRef = useRef<Set<string>>(new Set());
  const socketRef = useRef<any>(null);

  const addOrReplaceRemoteStream = (socketId: string, stream: MediaStream, name: string) => {
    setRemoteStreams(prev => {
      const filtered = prev.filter(r => r.id !== socketId);
      return [...filtered, { id: socketId, stream, name }];
    });
  };

  const getOrCreatePeer = (socketId: string) => {
    if (peersRef.current[socketId]) return peersRef.current[socketId];

    const pc = new RTCPeerConnection(ICE_SERVERS);

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current!));
    }

    pc.ontrack = event => {
      console.log('remote stream from', socketId, event.streams);
      if (event.streams && event.streams[0]) {
        const name = peersNameRef.current[socketId] || 'participant';
        addOrReplaceRemoteStream(socketId, event.streams[0], name);
      }
    };

    pc.onicecandidate = event => {
      if (event.candidate) {
        console.log('[pc.onicecandidate] -> sendIceCandidate to', socketId, event.candidate);
        sendIceCandidate(socketId, event.candidate);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log(`[pc iceState] ${socketId}:`, pc.iceConnectionState);
    };

    peersRef.current[socketId] = pc;
    return pc;
  };

  
  const createOfferPeer = async (socketId: string) => {
    const pc = getOrCreatePeer(socketId);

    if (!localStreamRef.current) {
      console.log('[createOfferPeer] local stream not ready, queueing target', socketId);
      pendingTargetsRef.current.add(socketId);
      return;
    }

    try {
      console.log('[createOfferPeer] creating offer for', socketId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
  
      sendOffer(socketId, offer);
      console.log('[createOfferPeer] offer sent to', socketId);
    } catch (err) {
      console.error('[createOfferPeer] error for', socketId, err);
    }
  };

  useEffect(() => {
    socketRef.current = connectVideoSocket(token);

    const handleCurrentParticipants = (participants: { socketId: string; name: string }[]) => {
      console.log('[onCurrentParticipants] got:', participants);
      
      participants.forEach(p => {
        peersNameRef.current[p.socketId] = p.name;
        createOfferPeer(p.socketId);
      });
    };

    const handleUserJoined = (data: { socketId: string, name: string }) => {
      console.log('[onUserJoined] user joined:', data.socketId);
      peersNameRef.current[data.socketId] = data.name;
      createOfferPeer(data.socketId);
    };

    const handleUserLeft = (data: { socketId: string }) => {
      console.log('[onUserLeft] user left:', data.socketId);
      if (peersRef.current[data.socketId]) {
        peersRef.current[data.socketId].close();
        delete peersRef.current[data.socketId];
      }
      setRemoteStreams(prev => prev.filter(r => r.id !== data.socketId));
      toast.info('Participant has left the call');
      delete peersNameRef.current[data.socketId];
    };

    const handleOffer = async ({ offer, from }: { offer: RTCSessionDescriptionInit; from: string }) => {
      console.log('[onOffer] received offer from', from, offer);
      const pc = getOrCreatePeer(from);
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sendAnswer(from, answer);
        console.log('[onOffer] answer sent to', from);
      } catch (err) {
        console.error('[onOffer] failed processing offer from', from, err);
      }
    };

    const handleAnswer = async ({ answer, from }: { answer: RTCSessionDescriptionInit; from: string }) => {
      console.log('[onAnswer] received answer from', from);
      const pc = peersRef.current[from];
      if (!pc) {
        console.warn('[onAnswer] no pc found for', from);
        return;
      }
    
      if (pc.signalingState === 'have-local-offer' || pc.signalingState === 'have-remote-offer' || pc.signalingState === 'stable') {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          console.log('[onAnswer] setRemoteDescription successful for', from);
        } catch (err) {
          console.error('[onAnswer] setRemoteDescription failed for', from, pc.signalingState, err);
        }
      } else {
        console.warn('[onAnswer] unexpected signalingState for', from, pc.signalingState);
      }
    };

    const handleIce = async ({ candidate, from }: { candidate: RTCIceCandidateInit; from: string }) => {
      const pc = peersRef.current[from];
      if (!pc) {
        console.warn('[onIceCandidate] pc not found for', from);
        return;
      }
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
        console.log('[onIceCandidate] added candidate from', from);
      } catch (err) {
        console.error('[onIceCandidate] error adding candidate from', from, err);
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
      console.log('Local stream tracks:', stream.getTracks());
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(err => console.warn('Local video play prevented:', err));
      }
      
      console.log('stream: ', stream);
      console.log('localStreamRef.current: ', localStreamRef.current);

      // attach tracks to any already-created peer connections
      Object.values(peersRef.current).forEach(pc => {
        try {
          stream.getTracks().forEach(track => pc.addTrack(track, stream));
        } catch (e) {
          console.warn('[join] error adding track to existing pc', e);
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
      console.error('Failed to access camera/mic:', err);
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
    console.log('toggle');
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
