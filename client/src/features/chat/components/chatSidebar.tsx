import { useEffect, useState } from 'react';
import { chatApi } from '@/services/api/chat';
import type { IUserChatConsultationDto, IPsychologistChatConsultationDto } from '@/types/dtos/consultation';
import { handleApiError } from '@/lib/utils/handleApiError';
import { toast } from 'react-toastify';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';
import { getSocket, onMessage, joinConsultation, onOnlineUsers } from '@/services/api/socket';
import type { IMessageDto } from '@/types/dtos/message';
import { uniqBy } from 'lodash';
import { generalMessages } from '@/messages/GeneralMessages';
import { UserRole, type UserRoleType } from '@/constants/types/User';
import { logger } from '@/lib/utils/logger';

export default function ChatSidebar({
  userId,
  role,
  onSelect,
}: {
  userId: string;
  role: UserRoleType;
  onSelect: (c: IUserChatConsultationDto | IPsychologistChatConsultationDto) => void;
}) {
  const [chats, setChats] = useState<(IUserChatConsultationDto | IPsychologistChatConsultationDto)[]>(
    []
  );
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    return onOnlineUsers(setOnlineUsers);
  }, []);

  // fetch consultations
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = role === UserRole.USER ? await chatApi.getChatByPatient() : await chatApi.getChatByPsychologist();
        if (!res.data) {
          toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
          return;
        }

        let rooms = res.data.rooms;
        if (role === UserRole.PSYCHOLOGIST) {
          rooms = uniqBy(rooms as IPsychologistChatConsultationDto[], c => c.patient.id);
        } else {
          rooms = uniqBy(rooms as IUserChatConsultationDto[], c => c.psychologist.id);
        }

        const sorted = [...rooms].sort((a, b) => {
          const aTime = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
          const bTime = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
          return bTime - aTime;
        });

        setChats(sorted);

        // join all rooms immediately for real-time updates
        const socket = getSocket();
        if (!socket) return;

        rooms.forEach(async (r: IUserChatConsultationDto | IPsychologistChatConsultationDto) => {
          try {
            await joinConsultation(r.roomId);
          } catch (err) {
            logger.debug(`Failed to join room ${r.roomId}:`, err);
          }
        });

      } catch (error) {
        handleApiError(error);
      }
    };
    fetchChats();
  }, [role]);

  // handle incoming messages globally
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleMessage = (message: IMessageDto) => {
      setChats(prev => {
        const updated = prev.map(r =>
          r.roomId === message.roomId
            ? {
              ...r,
              lastMessage: {
                id: message.id,
                content: message.content,
                createdAt: message.createdAt,
              },
              unreadCount:
                r.roomId === selectedChatId
                  ? 0
                  : message.senderId === userId
                    ? r.unreadCount || 0
                    : (r.unreadCount || 0) + 1,
            }
            : r
        );

        return [...updated].sort((a, b) => {
          const aTime = a.lastMessage?.createdAt ?? 0;
          const bTime = b.lastMessage?.createdAt ?? 0;
          return new Date(bTime).getTime() - new Date(aTime).getTime();
        });
      });
    };

    socket.on('message_read', ({ roomId, userId }: { roomId: string; userId: string }) => {
      setChats(prev => prev.map(r => (r.roomId === roomId ? { ...r, unreadCount: 0 } : r)));
    });

    const cleanupMessage = onMessage(handleMessage);

    return () => {
      cleanupMessage();
      socket.off('message_read');
    };
  }, [selectedChatId, userId]);

  const handleSelect = (chat: IUserChatConsultationDto | IPsychologistChatConsultationDto) => {
    setSelectedChatId(chat.roomId);
    onSelect(chat);

    const socket = getSocket();
    if (!socket) return;

    // mark messages as read
    socket.emit('mark_as_read', chat.roomId, userId);

    setChats(prev => prev.map(c => (c.roomId === chat.roomId ? { ...c, unreadCount: 0 } : c)));
  };

  return (
    <div className="w-full sm:w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Chats</h3>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {chats.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">No consultations booked yet!</div>
          ) : (
            chats
              .map(c => (
                <div
                  key={c.roomId}
                  onClick={() => handleSelect(c)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                    selectedChatId === c.roomId ? 'bg-green-100 text-green-900' : 'hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          role === UserRole.USER
                            ? (getCloudinaryUrl((c as IUserChatConsultationDto).psychologist.profileImage) ?? undefined)
                            : (getCloudinaryUrl((c as IPsychologistChatConsultationDto).patient.profileImage) ??
                              undefined)
                        }
                        className="rounded-full"
                      />
                      <AvatarFallback>
                        {role === UserRole.USER
                          ? (c as IUserChatConsultationDto).psychologist.name[0]
                          : (c as IPsychologistChatConsultationDto).patient.name[0]}
                      </AvatarFallback>
                    </Avatar>

                    {/* ONLINE INDICATOR */}
                    {onlineUsers.has(
                      role === UserRole.USER
                        ? (c as IUserChatConsultationDto).psychologist.userId
                        : (c as IPsychologistChatConsultationDto).patient.id
                    ) && (
                      <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {role === UserRole.USER
                        ? (c as IUserChatConsultationDto).psychologist.name
                        : (c as IPsychologistChatConsultationDto).patient.name}
                    </p>
                    {c.lastMessage?.content && (
                      <p className="text-xs text-gray-500 truncate max-w-[180px]">{c.lastMessage.content}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-end space-y-1">
                    {c.lastMessageTime && (
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {new Date(c.lastMessageTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                    {c.unreadCount > 0 && (
                      <span className="bg-green-500 text-white text-xs font-semibold rounded-full px-2 py-0.5">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
