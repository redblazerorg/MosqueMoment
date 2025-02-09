import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

interface NotificationContextType {
  savePushToken: (userEmail: string, token: string) => Promise<void>;
  sendNotificationToSubscribers: (mosqueId: number, title: string, body: string) => Promise<void>;
  getUserPushToken: (userEmail: string) => Promise<string | null>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const savePushToken = async (userEmail: string, token: string) => {
    try {
      await AsyncStorage.setItem(`pushToken_${userEmail}`, token);
    } catch (error) {
      console.error('Error saving push token:', error);
    }
  };

  const getUserPushToken = async (userEmail: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(`pushToken_${userEmail}`);
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  };

  const sendNotificationToSubscribers = async (mosqueId: number, title: string, body: string) => {
    try {
      // Get all users' subscriptions
      const allKeys = await AsyncStorage.getAllKeys();
      const subscriptionKeys = allKeys.filter(key => key.startsWith('subscriptions_'));
      
      for (const key of subscriptionKeys) {
        const userEmail = key.replace('subscriptions_', '');
        const subscriptionsJson = await AsyncStorage.getItem(key);
        const subscriptions = subscriptionsJson ? JSON.parse(subscriptionsJson) : [];
        
        // Check if user is subscribed to this mosque
        if (subscriptions.includes(mosqueId)) {
          const pushToken = await getUserPushToken(userEmail);
          
          if (pushToken) {
            // Send notification using Expo's push notification service
            await fetch('https://exp.host/--/api/v2/push/send', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                to: pushToken,
                sound: 'default',
                title,
                body,
                data: { mosqueId },
              }),
            });
          }
        }
      }
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{
      savePushToken,
      sendNotificationToSubscribers,
      getUserPushToken,
    }}>
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