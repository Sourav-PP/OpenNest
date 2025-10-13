import { useEffect, useRef, useState } from 'react';
import { joinConsultation, onError, onMessage, onMessageDelete, sendMessage, deleteMessage, emitTyping, emitStopTyping, onTyping } from '@/services/api/socket';
import { toast } from 'react-toastify';
import type { IMessageDto } from '@/types/dtos/message';
import { chatApi } from '@/services/api/chat';
import { handleApiError } from '@/lib/utils/handleApiError';
import type { IChatError } from '@/types/api/chat';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';

export function useChat(consultationId: string) {
  const [messages, setMessages] = useState<IMessageDto[]>([]);
  const [isReady, setIsReady] = useState(false);
  const { userId } = useSelector((state: RootState) => state.auth);
  const [peerTyping, setPeerTyping] = useState(false);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // fetching the chat history
  useEffect(() => {
    if (!consultationId) return;

    let isMounted = true;

    const fetchHistory = async () => {
      try {
        const res = await chatApi.getChatHistory(consultationId);

        if (isMounted && res.data) {
          const transformedMessage = res.data.messages.map(msg => {
            if(msg.deleted) {
              return {
                ...msg,
                content: msg.deletedBy === userId ? 'You deleted this message' : 'This message was deleted',
              };
            }
            return msg;
          });
          setMessages(transformedMessage);
          setIsReady(true); // mark ready right here
        }

        await joinConsultation(consultationId);
        console.log(`useChat joined consultation: ${consultationId}`);
      } catch (error) {
        handleApiError(error);
        if (isMounted) setIsReady(true);
      }
    };
    fetchHistory();

    const handleMessage = (msg: IMessageDto) => {
      console.log('useChat received new_message:', msg);
      if (msg.consultationId === consultationId) {
        setMessages(prev => {
          if (prev.some(m => m.id === msg.id)) {
            console.log('Duplicate message ignored:', msg.id);
            return prev;
          }
          return [...prev, msg];
        });
      }
    };

    const handleMessageDeleted = (data: { 
      messageId: string;
      consultationId: string;
      deletedBy: string;
      isDeleted: boolean;
     }) => {
      if(data.consultationId === consultationId) {
        setMessages(prev =>
          prev.map(m => {
            if(m.id === data.messageId) {
              return {
                ...m,
                content: data.deletedBy === userId ? 'You deleted this message' : 'This message was deleted',
                deleted: data.isDeleted,
                deletedBy: data.deletedBy,
              };
            }
            return m;
          })
        );
      }
    };

    const handleError = (err: IChatError) => {
      toast.error(err.message || 'Something went wrong');
    };

    const cleanupTyping = onTyping(({ consultationId: cId, senderId }) => {
      if (cId === consultationId && senderId !== userId) {
        setPeerTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setPeerTyping(false), 2000);
      }
    });

    const cleanupMessage = onMessage(handleMessage);
    const cleanupDelete = onMessageDelete(handleMessageDeleted);
    const cleanupError = onError(handleError);

    return () => {
      isMounted = false;
      cleanupMessage();
      cleanupDelete();
      cleanupError();
      cleanupTyping();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      console.log('Cleaning up useChat listeners');
    };
  }, [consultationId, userId]);

  const handleDelete = (data: {messageId: string, consultationId: string}) => {
    deleteMessage(data);
  };

  const handleSend = (data: {
    consultationId: string;
    senderId: string;
    receiverId: string;
    content?: string;
    mediaUrl?: string;
    mediaType?: string;
  }) => {
    if (!isReady) {
      console.warn('Chat not ready yet, cannot send message');
      return;
    }
    sendMessage(data);
  };

  const handleTyping = () => emitTyping(consultationId);
  const handleStopTyping = () => emitStopTyping(consultationId);

  return { messages, sendMessage: handleSend, isReady, handleDelete, peerTyping, handleTyping, handleStopTyping };
}
