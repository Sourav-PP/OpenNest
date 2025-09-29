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
  const [remoteStreams, setRemoteStreams] = useState<{ id: string; stream: MediaStream }[]>([]);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<Record<string, RTCPeerConnection>>({});
  const pendingTargetsRef = useRef<Set<string>>(new Set()); // targets we must create offers to after we have local stream
  const socketRef = useRef<any>(null);

  // helper to attach remote stream
  const addOrReplaceRemoteStream = (socketId: string, stream: MediaStream) => {
    setRemoteStreams(prev => {
      const filtered = prev.filter(r => r.id !== socketId);
      return [...filtered, { id: socketId, stream }];
    });
  };

  // one peer per remote socketId
  const getOrCreatePeer = (socketId: string) => {
    if (peersRef.current[socketId]) return peersRef.current[socketId];

    const pc = new RTCPeerConnection(ICE_SERVERS);

    // add local tracks if available
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current!));
    }

    pc.ontrack = event => {
      console.log('[pc.ontrack] remote stream from', socketId, event.streams);
      if (event.streams && event.streams[0]) addOrReplaceRemoteStream(socketId, event.streams[0]);
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

  // new joiner creates offers to existing participants — but only after local stream ready
  const createOfferPeer = async (socketId: string) => {
    // if peer already exists, skip - but still ensure local tracks are attached
    const pc = getOrCreatePeer(socketId);

    // ensure local tracks present; if not, queue and return
    if (!localStreamRef.current) {
      console.log('[createOfferPeer] local stream not ready, queueing target', socketId);
      pendingTargetsRef.current.add(socketId);
      return;
    }

    try {
      console.log('[createOfferPeer] creating offer for', socketId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      // send offer to the particular remote socket id
      sendOffer(socketId, offer);
      console.log('[createOfferPeer] offer sent to', socketId);
    } catch (err) {
      console.error('[createOfferPeer] error for', socketId, err);
    }
  };

  useEffect(() => {
    // initialize socket and handlers
    socketRef.current = connectVideoSocket(token);

    // When we receive a list of existing participants (this event is emitted to the new joiner)
    const handleCurrentParticipants = (participants: string[]) => {
      console.log('[onCurrentParticipants] got:', participants);
      // clear any previous pending set: we will try creating offers now or queue if local stream not ready
      participants.forEach(targetId => {
        createOfferPeer(targetId);
      });
    };

    const handleUserJoined = (data: { socketId: string }) => {
      console.log('[onUserJoined] user joined:', data.socketId);
    };

    const handleUserLeft = (data: { socketId: string }) => {
      console.log('[onUserLeft] user left:', data.socketId);
      if (peersRef.current[data.socketId]) {
        peersRef.current[data.socketId].close();
        delete peersRef.current[data.socketId];
      }
      setRemoteStreams(prev => prev.filter(r => r.id !== data.socketId));
      toast.info('Participant has left the call');
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
      // Only set remote description if we are the offerer and the pc is expecting an answer
      // i.e. signalingState should be "have-local-offer"
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

    // register listeners using your provided wrappers (they rely on the shared socket singleton)
    onCurrentParticipants(handleCurrentParticipants);
    onUserJoined(handleUserJoined);
    onUserLeft(handleUserLeft);
    onOffer(handleOffer);
    onAnswer(handleAnswer);
    onIceCandidate(handleIce);

    // cleanup function
    return () => {
      // remove listeners (same event names used inside videoSocket.ts)
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

  // join: fetch local media before letting backend send participants (we call joinCall after obtaining media)
  const join = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log('Local stream tracks:', stream.getTracks());
      localStreamRef.current = stream;
      
      // Set the stream immediately and force a re-render
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        // Force play to ensure video starts
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

      // now tell server we joined so it will manage room membership
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
    return enabled; // returns new state
  };

  const toggleCamera = () => {
    console.log('toggle');
    if (!localStreamRef.current) return false;
    const enabled = !localStreamRef.current.getVideoTracks()[0]?.enabled;
    localStreamRef.current.getVideoTracks().forEach(track => (track.enabled = enabled));
    return enabled; // returns new state
  };

  const leave = () => {
    leaveCall(consultationId);
    Object.values(peersRef.current).forEach(pc => pc.close());
    peersRef.current = {};
    setRemoteStreams([]);
    setJoined(false);

    // stop local tracks to release camera/mic
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
    }
  };

  return { localVideoRef, remoteStreams, joined, join, leave, toggleMute, toggleCamera, localStreamRef };
}
