import { useEffect, useState } from 'react';
import { chatApi } from '@/services/api/chat';
import type { IUserChatConsultationDto, IPsychologistChatConsultationDto } from '@/types/dtos/consultation';
import { handleApiError } from '@/lib/utils/handleApiError';
import { toast } from 'react-toastify';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';
import { getSocket, onMessage, joinConsultation } from '@/services/api/socket';
import type { IMessageDto } from '@/types/dtos/message';

export default function ChatSidebar({
  userId,
  role,
  onSelect,
}: {
  userId: string;
  role: 'user' | 'psychologist';
  onSelect: (c: IUserChatConsultationDto | IPsychologistChatConsultationDto) => void;
}) {
  const [consultations, setConsultations] = useState<(IUserChatConsultationDto | IPsychologistChatConsultationDto)[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  // fetch consultations
  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const res =
          role === 'user'
            ? await chatApi.getChatByPatient()
            : await chatApi.getChatByPsychologist();

        if (!res.data) {
          toast.error('Something went wrong');
          return;
        }
        console.log('res:fdhdfd: ', res);

        setConsultations(res.data.consultations);

        // join all rooms immediately for real-time updates
        const socket = getSocket();
        if (!socket) return;

        res.data.consultations.forEach(async (c: IUserChatConsultationDto | IPsychologistChatConsultationDto) => {
          try {
            await joinConsultation(c.id);
            console.log(`Joined room on load: ${c.id}`);
          } catch (err) {
            console.error(`Failed to join room ${c.id}:`, err);
          }
        });

      } catch (error) {
        handleApiError(error);
      }
    };
    fetchConsultations();
  }, [role]);

  // handle incoming messages globally
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleMessage = (message: IMessageDto) => {
      setConsultations(prev =>
        prev.map(c =>
          c.id === message.consultationId
            ? {
              ...c,
              lastMessage: {
                id: message.id,
                content: message.content,
                createdAt: message.createdAt,
              },
              unreadCount: c.id === selectedChatId
                ? 0
                : message.senderId === userId
                  ? c.unreadCount || 0
                  : (c.unreadCount || 0) + 1,
            }
            : c
        )
      );
    };

    socket.on('message_read', ({ consultationId, userId }: { consultationId: string; userId: string }) => {
      setConsultations(prev =>
        prev.map(c =>
          c.id === consultationId ? { ...c, unreadCount: 0 } : c
        )
      );
    });

    const cleanupMessage = onMessage(handleMessage);

    return () => {
      cleanupMessage();
      socket.off('message_read');
    };
  }, [selectedChatId, userId]);

  const handleSelect = (consultation: IUserChatConsultationDto | IPsychologistChatConsultationDto) => {
    setSelectedChatId(consultation.id);
    onSelect(consultation);

    const socket = getSocket();
    if (!socket) return;

    // mark messages as read
    socket.emit('mark_as_read', consultation.id, userId);

    setConsultations(prev =>
      prev.map(c => (c.id === consultation.id ? { ...c, unreadCount: 0 } : c))
    );
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
          {consultations.map(c => (
            <div
              key={c.id}
              onClick={() => handleSelect(c)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                selectedChatId === c.id
                  ? 'bg-green-100 text-green-900'
                  : 'hover:bg-gray-100 text-gray-900'
              }`}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={
                    role === 'user'
                      ? getCloudinaryUrl((c as IUserChatConsultationDto).psychologist.profileImage) ?? undefined
                      : getCloudinaryUrl((c as IPsychologistChatConsultationDto).patient.profileImage) ?? undefined
                  }
                />
                <AvatarFallback>
                  {role === 'user'
                    ? (c as IUserChatConsultationDto).psychologist.name[0]
                    : (c as IPsychologistChatConsultationDto).patient.name[0]}
                </AvatarFallback>
              </Avatar>

              {/* Name + Last Message */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {role === 'user'
                    ? (c as IUserChatConsultationDto).psychologist.name
                    : (c as IPsychologistChatConsultationDto).patient.name}
                </p>
                {c.lastMessage?.content && (
                  <p className="text-xs text-gray-500 truncate max-w-[180px]">
                    {c.lastMessage.content}
                  </p>
                )}
              </div>
              
              {/* Last Message Time + Unread Badge */}
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
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
