import { useEffect, useState } from 'react';
import { joinConsultation, onError, onMessage, sendMessage } from '@/services/api/socket';
import { toast } from 'react-toastify';
import type { IMessageDto } from '@/types/dtos/message';
import { chatApi } from '@/services/api/chat';
import { handleApiError } from '@/lib/utils/handleApiError';
import type { IChatError } from '@/types/api/chat';

export function useChat(consultationId: string) {
  const [messages, setMessages] = useState<IMessageDto[]>([]);
  const [isReady, setIsReady] = useState(false);

  // fetching the chat history
  useEffect(() => {
    if (!consultationId) return;

    let isMounted = true;

    const fetchHistory = async () => {
      try {
        const res = await chatApi.getChatHistory(consultationId);

        if (isMounted && res.data) {
          setMessages(res.data.messages);
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

    const handleError = (err: IChatError) => {
      toast.error(err.message || 'Something went wrong');
    };

    const cleanupMessage = onMessage(handleMessage);
    const cleanupError = onError(handleError);

    return () => {
      isMounted = false;
      cleanupMessage();
      cleanupError();
      console.log('Cleaning up useChat listeners');
    };
  }, [consultationId]);

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

  return { messages, sendMessage: handleSend, isReady };
}
