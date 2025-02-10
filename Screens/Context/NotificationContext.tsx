import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

export type NotificationType = 'announcement' | 'activity';

export type Notification = {
  id: number;
  userEmail: string;
  mosqueId: number;
  mosqueName: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
};

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: number) => Promise<void>;
  getNotificationsForMosque: (mosqueId: number) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.email) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem(`notifications_${user?.email}`);
      if (stored) {
        const loadedNotifications = JSON.parse(stored);
        setNotifications(loadedNotifications);
        updateUnreadCount(loadedNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const saveNotifications = async (updatedNotifications: Notification[]) => {
    try {
      if (user?.email) {
        await AsyncStorage.setItem(
          `notifications_${user.email}`,
          JSON.stringify(updatedNotifications)
        );
        setNotifications(updatedNotifications);
        updateUnreadCount(updatedNotifications);
      }
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  };

  const updateUnreadCount = (notificationsList: Notification[]) => {
    const count = notificationsList.filter(n => !n.read).length;
    setUnreadCount(count);
  };

  const addNotification = async (
    notification: Omit<Notification, 'id' | 'createdAt' | 'read'>
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      createdAt: new Date(),
      read: false,
    };

    const updatedNotifications = [...notifications, newNotification];
    await saveNotifications(updatedNotifications);
  };

  const markAsRead = async (notificationId: number) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    await saveNotifications(updatedNotifications);
  };

  const markAllAsRead = async () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true,
    }));
    await saveNotifications(updatedNotifications);
  };

  const deleteNotification = async (notificationId: number) => {
    const updatedNotifications = notifications.filter(
      notification => notification.id !== notificationId
    );
    await saveNotifications(updatedNotifications);
  };

  const getNotificationsForMosque = (mosqueId: number): Notification[] => {
    return notifications.filter(notification => notification.mosqueId === mosqueId);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        getNotificationsForMosque,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};