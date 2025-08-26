import { useEffect, useState } from 'react';
import { socket, joinConsultation, sendMessage } from '@/services/api/socket';
import { toast } from 'react-toastify';
import type { IMessageDto } from '@/types/dtos/message';
import { chatApi } from '@/services/api/chat';
import { handleApiError } from '@/lib/utils/handleApiError';

export function useChat(consultationId: string) {
  const [messages, setMessages] = useState<IMessageDto[]>([]);

  useEffect(() => {
    if (!consultationId) return;

    (async () => {
      try {
        const res = await chatApi.getChatHistory(consultationId);
        console.log('res: ', res.data?.messages);
        if (!res.data) {
          toast.error('Something went wrong');
          return;
        }
        setMessages(res.data.messages);
      } catch (error) {
        handleApiError(error);
      }
    })();

    joinConsultation(consultationId);

    // listening for new messages
    socket.on('receive_message', msg => {
      setMessages(prev => [...prev, msg]);
    });

    // listening for errors
    socket.on('chat_error', err => {
      toast.error(err.message || 'Something went wrong');
    });

    return () => {
      socket.off('receive_message');
      socket.off('chat_error');
    };
  }, [consultationId]);

  return { messages, sendMessage };
}
