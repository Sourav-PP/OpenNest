import { useState, useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import type { IMessageDto } from '@/types/dtos/message';


export default function ChatWindow({
  consultationId,
  userId,
  peerId,
}: {
  consultationId: string;
  userId: string;
  peerId: string;
}) {
  const { messages, sendMessage, isReady } = useChat(consultationId);
  const [text, setText] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!text.trim()) return;
    console.log('text: ', text);
    sendMessage({
      consultationId,
      senderId: userId,
      receiverId: peerId,
      content: text,
    });
    console.log('send message', sendMessage);
    setText('');
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
      if(!acc[label]) acc[label] = [];
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
                {/* Date Divider */}
                <div className="flex justify-center">
                  <div className="bg-slate-50 shadow-lg text-gray-800 text-sm font-medium px-3 py-1 rounded-md">
                    {dateLabel}
                  </div>
                </div>

                {/* Messages */}
                {msgs.map(m => (
                  <div
                    key={m.id}
                    className={`flex ${m.senderId === userId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl shadow-md transition-all duration-200 ${
                        m.senderId === userId ? 'bg-[#D9FDD3] text-gray-900' : 'bg-white text-gray-900'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{m.content}</p>
                      {m.createdAt && (
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
      </ScrollArea>

      {/* Message Input Area */}
      <div className="p-3 bg-transparent border-t border-gray-200 shadow-sm absolute bottom-0 left-0 w-full">
        <div className="flex items-center gap-3 max-w-full">
          <Input
            className="flex-1 rounded-full border-gray-300 bg-gray-100 py-2 px-4 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={e => {
              if (e.key === 'Enter' && isReady && text.trim()) handleSend();
            }}
            disabled={!isReady}
          />
          <Button
            className="rounded-full bg-green-600 hover:bg-green-700 p-2.5 transition-colors duration-200"
            size="icon"
            onClick={handleSend}
            disabled={!isReady || !text.trim()}
          >
            <Send className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
