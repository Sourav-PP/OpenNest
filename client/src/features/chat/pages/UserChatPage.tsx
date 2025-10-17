import { useState } from 'react';
import ChatSidebar from '../components/chatSidebar';
import ChatWindow from '../components/chatWindow';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { IPsychologistChatConsultationDto, IUserChatConsultationDto } from '@/types/dtos/consultation';
import Sidebar from '@/components/user/Sidebar';
import Header from '@/components/user/Header';
import { UserRole } from '@/constants/types/User';

export default function PsychologistChatPage() {
  const { role, userId } = useSelector((state: RootState) => state.auth);
  const [selectedConsultation, setSelectedConsultation] = useState<
    IUserChatConsultationDto | IPsychologistChatConsultationDto | null
  >(null);
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);

  const toggleChatSidebar = () => {
    setIsChatSidebarOpen(!isChatSidebarOpen);
  };

  return (
    <div className="flex h-screen w-full bg-[#ECF1F3] text-primaryText overflow-hidden">
      {/* Main Navigation Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          {/* Chat Sidebar (for conversations) */}
          {(role === UserRole.USER || role === UserRole.PSYCHOLOGIST) && (
            <div
              className={`fixed inset-y-0 left-0 sm:static sm:w-80 w-full transform transition-transform duration-300 ease-in-out ${
                isChatSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
              } z-10 bg-white`}
              style={{ maxHeight: 'calc(100vh - 64px)', overflowY: 'auto' }}
            >
              <ChatSidebar
                userId={userId!}
                role={role}
                onSelect={c => {
                  setSelectedConsultation(c);
                  setIsChatSidebarOpen(false); // Close chat sidebar on mobile after selection
                }}
              />
            </div>
          )}

          {/* Chat Content */}
          <div className="flex-1 flex flex-col">
            {/* Mobile Chat Sidebar Toggle Button */}
            <Button
              className="sm:hidden fixed top-4 left-4 z-20 p-2 bg-green-600 hover:bg-green-700 text-white rounded-full"
              size="icon"
              onClick={toggleChatSidebar}
            >
              {isChatSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Chat Window or Placeholder */}
            {selectedConsultation ? (
              <ChatWindow
                consultationId={selectedConsultation.id}
                userId={userId!}
                peerId={
                  role === UserRole.USER
                    ? (selectedConsultation as IUserChatConsultationDto).psychologist.userId
                    : (selectedConsultation as IPsychologistChatConsultationDto).patient.id
                }
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-[#d5e2da]">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-700">Select a Chat</h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Choose a conversation from the sidebar to start chatting.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
