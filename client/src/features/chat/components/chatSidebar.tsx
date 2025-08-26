import { useEffect, useState } from 'react';
import { chatApi } from '@/services/api/chat';
import type { IConsultationDto, IPsychologistConsultationDto } from '@/types/dtos/consultation';
import { handleApiError } from '@/lib/utils/handleApiError';
import { toast } from 'react-toastify';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';

export default function ChatSidebar({
  role,
  onSelect,
}: {
  userId: string;
  role: 'user' | 'psychologist';
  onSelect: (c: IConsultationDto | IPsychologistConsultationDto) => void;
}) {
  const [consultations, setConsultations] = useState<
    (IConsultationDto | IPsychologistConsultationDto)[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

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

        console.log('res: ', res.data.consultations);

        setConsultations(res.data.consultations);
      } catch (error) {
        handleApiError(error);
      }
    };
    fetchConsultations();
  }, [role]);

  const handleSelect = (consultation: IConsultationDto | IPsychologistConsultationDto) => {
    setSelectedChatId(consultation.id);
    onSelect(consultation);
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
          {consultations.map((c) => (
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
                      ? getCloudinaryUrl((c as IConsultationDto).psychologist.profileImage) ?? undefined
                      : getCloudinaryUrl((c as IPsychologistConsultationDto).patient.profileImage) ?? undefined
                  }
                />
                <AvatarFallback>
                  {role === 'user'
                    ? (c as IConsultationDto).psychologist.name[0]
                    : (c as IPsychologistConsultationDto).patient.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {role === 'user'
                    ? (c as IConsultationDto).psychologist.name
                    : (c as IPsychologistConsultationDto).patient.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}