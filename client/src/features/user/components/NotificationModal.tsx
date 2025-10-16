// src/components/NotificationModal.tsx
import { X } from 'lucide-react';
import type { INotificationDto } from '@/types/dtos/notification';

interface NotificationModalProps {
  notifications: INotificationDto[];
  onClose: () => void;
}

export const NotificationModal = ({ notifications, onClose }: NotificationModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
      <div className="bg-white w-80 h-full shadow-xl overflow-y-auto relative">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg">Notifications</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-600 hover:text-black" />
          </button>
        </div>

        {notifications.length === 0 ? (
          <p className="p-4 text-gray-500 text-sm">No notifications yet</p>
        ) : (
          <ul>
            {notifications.map(n => (
              <li key={n.id} className={`p-3 border-b cursor-pointer ${n.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                <p className="text-sm">{n.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
