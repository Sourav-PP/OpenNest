import { useState, useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DeleteIcon, FileIcon, Link, Send, X } from 'lucide-react';
import type { IMessageDto } from '@/types/dtos/message';
import { chatApi } from '@/services/api/chat';
import { toast } from 'react-toastify';
import { handleApiError } from '@/lib/utils/handleApiError';
import { getSocket, onOnlineUsers } from '@/services/api/socket';
import ConfirmationModal from '@/components/user/ConfirmationModal';
import type { Socket } from 'socket.io-client';

export default function ChatWindow({
  consultationId,
  userId,
  peerId,
}: {
  consultationId: string;
  userId: string;
  peerId: string;
}) {
  const { messages, sendMessage, isReady, handleDelete, peerTyping, handleTyping, handleStopTyping } = useChat(consultationId);
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<{ messageId: string; consultationId: string } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);


  useEffect(() => {
    return onOnlineUsers(setOnlineUsers);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  console.log('isReady:', isReady, 'messages:', messages);

  const confirmDeleteMessage = (id: string, consultationId: string) => {
    setMessageToDelete({ messageId: id, consultationId });
    setDeleteModalOpen(true);
  };

  
  const handleConfirmDelete = async () => {
    if(!messageToDelete) return;

    setConfirmLoading(true);
    try {
      await handleDelete(messageToDelete);
      setDeleteModalOpen(false);
      setMessageToDelete(null);
    } catch (error) {
      toast.error('Failed to delete message');
      console.log('delete message error: ',error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleSend = async () => {
    if (!text.trim() && !file) return;
    console.log('text: ', text);

    let mediaUrl, mediaType;

    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await chatApi.uploadMedia(formData);

        console.log('res:::::', res);
        if (!res.data) {
          toast.error('something went wrong');
          return;
        }

        mediaUrl = res.data.mediaUrl;
        mediaType = res.data.mediaType;
      } catch (error) {
        handleApiError(error);
        return;
      }
    }

    sendMessage({
      consultationId,
      senderId: userId,
      receiverId: peerId,
      content: text || '',
      mediaUrl,
      mediaType,
    });
    console.log('send message', sendMessage);
    setText('');
    setFile(null);
    handleStopTyping();
  };

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateLabel = (iso: string) => {
    const date = new Date(iso);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';

    return date.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // group by date
  const messagesByDate: Record<string, IMessageDto[]> = messages.reduce(
    (acc, msg) => {
      const label = formatDateLabel(msg.createdAt);
      if (!acc[label]) acc[label] = [];
      acc[label].push(msg);
      return acc;
    },
    {} as Record<string, IMessageDto[]>
  );

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current;
      const isNearBottom =
        scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight < 100;
      if (isNearBottom) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const isPeerOnline = onlineUsers.has(peerId);

  const renderFilePreview = (file: File) => {
    return (
      <div className="relative flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
        {file.type.startsWith('image/') ? (
          <img
            src={URL.createObjectURL(file)}
            className="h-16 w-16 object-cover rounded-md"
            alt={file.name}
          />
        ) : (
          <div className="flex items-center gap-2">
            <FileIcon className="h-8 w-8 text-gray-500" />
            <span className="text-sm text-gray-700 truncate max-w-[150px]">{file.name}</span>
          </div>
        )}
        <button
          onClick={() => setFile(null)}
          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
          aria-label="Remove file"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#ECF1F3] relative">
      {/* Chat Messages Area */}
      <ScrollArea
        className="h-[calc(100%-60px)] w-full bg-[#d5e2da] bg-chat_doodle bg-contain relative"
        ref={scrollAreaRef}
      >
        <div className="space-y-4 p-4">
          {!isReady ? (
            <div className="text-center text-gray-500 py-4">Loading chat...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              <span className="inline-block px-6 py-3 bg-gray-50 border border-gray-200 rounded-lg font-medium text-sm shadow-sm">
                No messages yet
              </span>
            </div>
          ) : (
            Object.entries(messagesByDate).map(([dateLabel, msgs]) => (
              <div key={dateLabel} className="space-y-4">
                <div className="flex justify-center">
                  <div className="bg-slate-50 shadow-lg text-gray-800 text-sm font-medium px-3 py-1 rounded-md">
                    {dateLabel}
                  </div>
                </div>

                {msgs.map(m => (
                  <div
                    key={m.id}
                    className={`flex ${m.senderId === userId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`relative max-w-[75%] p-3 rounded-2xl shadow-md transition-all duration-200 ${
                        m.deleted
                          ? 'bg-gray-100 text-gray-500 italic border border-gray-300'
                          : m.senderId === userId
                            ? 'bg-[#D9FDD3] text-gray-900'
                            : 'bg-white text-gray-900'
                      }`}
                    >
                      {!m.deleted && m.senderId === userId && (
                        <DeleteIcon 
                          onClick={() => confirmDeleteMessage(m.id, m.consultationId)} 
                          className="w-4 h-4 absolute top-1 right-1 text-red-400 hover:text-red-600 cursor-pointer"
                        />
                      )}
                      {/* Text */}
                      {m.content && <p className="text-sm leading-relaxed">{m.content}</p>}

                      {!m.deleted && m.mediaUrl && m.mediaType === 'image' && (
                        <img
                          src={m.mediaUrl}
                          alt="media"
                          className="mt-1 max-w-full max-h-60 rounded-md object-contain"
                        />
                      )}

                      {!m.deleted && m.mediaUrl && m.mediaType === 'video' && (
                        <video
                          src={m.mediaUrl}
                          controls
                          className="mt-1 max-w-full max-h-60 rounded-md"
                        />
                      )}

                      {!m.deleted && m.mediaUrl && m.mediaType === 'audio' && (
                        <audio src={m.mediaUrl} controls className="mt-1 block max-w-full" />
                      )}

                      {!m.deleted && m.mediaUrl &&
                        m.mediaType &&
                        !['image', 'video', 'audio'].includes(m.mediaType) && (
                        <div className="mt-1 p-2 bg-gray-100 rounded-md text-sm text-gray-700 truncate">
                          {m.mediaUrl.split('/').pop()}
                        </div>
                      )}

                      {/* Timestamp */}
                      {m.createdAt && !m.deleted && (
                        <p className="text-xs text-gray-500 mt-1 text-right">
                          {formatTime(m.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
        {peerTyping && (
          <div className="px-4 py-1 text-sm text-gray-600 italic">
            typing...
          </div>
        )}

      </ScrollArea>

      {/* Message Input Area */}
      <div className="p-3 bg-transparent border-t border-gray-200 shadow-sm absolute bottom-0 left-0 w-full">
        <div className="flex items-center gap-3 max-w-full">
          {/* File input */}
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*,video/*,audio/*"
              onChange={handleFileChange}
            />
            <Link className="h-6 w-6 text-gray-600 hover:text-gray-800" />
          </label>

          {/* Text input */}
          <Input
            className="flex-1 rounded-full border-gray-300 bg-gray-100 py-2 px-4 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            value={text}
            onChange={e => {
              setText(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            onKeyDown={e => {
              if (e.key === 'Enter' && isReady && (text.trim() || file)) handleSend();
            }}
            disabled={!isReady}
          />
          <Button
            className="rounded-full bg-green-600 hover:bg-green-700 p-2.5 transition-colors duration-200"
            size="icon"
            onClick={handleSend}
            disabled={!isReady || (!text.trim() && !file)}
          >
            <Send className="h-5 w-5 text-white" />
          </Button>
        </div>

        {/* Preview selected file */}
        {file && <div className="mt-3">{renderFilePreview(file)}</div>}
      </div>
      <ConfirmationModal
        title="Delete Message"
        description="Are you sure you want to delete this message?"
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        confirmLoading={confirmLoading}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
