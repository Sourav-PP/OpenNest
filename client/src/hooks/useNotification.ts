import { useCallback, useEffect, useState } from 'react';
import { onNotification } from '@/services/api/notificationSocket';
import { toast } from 'react-toastify';
import { handleApiError } from '@/lib/utils/handleApiError';
import { userApi } from '@/services/api/user';
import type { INotificationDto } from '@/types/dtos/notification';
import { generalMessages } from '@/messages/GeneralMessages';

export const useNotification = () => {
  const [notifications, setNotifications] = useState<INotificationDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await userApi.getNotifications();
      if (!res.data) {
        toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
        return;
      }

      setNotifications(res.data);
    } catch (error) {
      handleApiError(error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onNotification(data => {
      toast.info(data.message);

      setNotifications(prev => [data, ...prev]);
    });

    fetchNotifications();

    return () => {
      unsubscribe();
    };
  }, [fetchNotifications]);

  // unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await userApi.markAllNotificationAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      handleApiError(err);
    }
  };

  const toggleModal = () => {
    if (!isModalOpen) markAllAsRead();
    setIsModalOpen(prev => !prev);
  };

  return {
    notifications,
    unreadCount,
    isModalOpen,
    toggleModal,
  };
};
