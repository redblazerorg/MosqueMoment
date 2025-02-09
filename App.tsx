import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import AppNavigation from "./navigations/AppNavigation";
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./Screens/Context/AuthContext";
import { NotificationProvider, useNotifications } from "./Screens/Context/NotificationContext";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function AppContent() {
  const { user } = useAuth();
  const { savePushToken } = useNotifications();

  async function registerForPushNotificationsAsync() {
    let token;

    // Request permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    // Get Expo push token
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: "bda8f256-b53a-4506-959a-8d9d26188c5a"
    })).data;
    
    // Save token if user is logged in
    if (user?.email) {
      await savePushToken(user.email, token);
    }
    
    return token;
  }

  useEffect(() => {
    if (user?.email) {
      registerForPushNotificationsAsync();
    }

    // Handle notifications when app is foregrounded
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Foreground notification:', notification);
    });

    // Handle notifications when user taps on them
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Background notification response:', response);
    });

    return () => {
      foregroundSubscription.remove();
      backgroundSubscription.remove();
    };
  }, [user]); // Add user as dependency to re-run when user logs in

  return <AppNavigation />;
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}