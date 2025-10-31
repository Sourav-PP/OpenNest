import { useEffect, useRef, useState } from 'react';
import {
  joinConsultation,
  onError,
  onMessage,
  onMessageDelete,
  sendMessage,
  deleteMessage,
  emitTyping,
  emitStopTyping,
  onTyping,
} from '@/services/api/socket';
import { toast } from 'react-toastify';
import type { IMessageDto } from '@/types/dtos/message';
import { chatApi } from '@/services/api/chat';
import { handleApiError } from '@/lib/utils/handleApiError';
import type { IChatError } from '@/types/api/chat';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { logger } from '@/lib/utils/logger';
import { generalMessages } from '@/messages/GeneralMessages';

export function useChat(roomId: string) {
  const [messages, setMessages] = useState<IMessageDto[]>([]);
  const [isReady, setIsReady] = useState(false);
  const { userId } = useSelector((state: RootState) => state.auth);
  const [peerTyping, setPeerTyping] = useState(false);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // fetching the chat history
  useEffect(() => {
    if (!roomId) return;

    let isMounted = true;

    const fetchHistory = async () => {
      try {
        const res = await chatApi.getChatHistory(roomId);

        if (isMounted && res.data) {
          const transformedMessage = res.data.messages.map(msg => {
            if (msg.deleted) {
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
      
        await joinConsultation(roomId);
        logger.info(`Joined chat room: ${roomId}`);
      } catch (error) {
        handleApiError(error);
        logger.error(`Failed to fetch or join chat: ${roomId}`, error);
        if (isMounted) setIsReady(true);
      }
    };
    fetchHistory();

    const handleMessage = (msg: IMessageDto) => {
      if (msg.roomId === roomId) {
        setMessages(prev => {
          if (prev.some(m => m.id === msg.id)) {
            logger.debug(`Duplicate message ignored: ${msg.id}`);
            return prev;
          }
          return [...prev, msg];
        });
      }
    };

    const handleMessageDeleted = (data: {
      messageId: string;
      roomId: string;
      deletedBy: string;
      isDeleted: boolean;
    }) => {
      if (data.roomId === roomId) {
        setMessages(prev =>
          prev.map(m => {
            if (m.id === data.messageId) {
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
      toast.error(err.message || generalMessages.ERROR.INTERNAL_SERVER_ERROR);
      logger.error('Socket error in chat:', err);
    };

    const cleanupTyping = onTyping(({ roomId: cId, senderId }) => {
      if (cId === roomId && senderId !== userId) {
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
    };
  }, [roomId, userId]);

  const handleDelete = (data: { messageId: string; roomId: string }) => {
    deleteMessage(data);
  };

  const handleSend = (data: {
    roomId: string;
    senderId: string;
    receiverId: string;
    content?: string;
    mediaUrl?: string;
    mediaType?: string;
  }) => {
    if (!isReady) {
      return;
    }
    sendMessage(data);
  };

  const handleTyping = () => emitTyping(roomId);
  const handleStopTyping = () => emitStopTyping(roomId);

  return { messages, sendMessage: handleSend, isReady, handleDelete, peerTyping, handleTyping, handleStopTyping };
}
