import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import AppNavigation from "./navigations/AppNavigation";

import { AuthProvider } from "./Screens/Context/AuthContext";
import { NotificationProvider } from "./Screens/Context/NotificationContext";

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppNavigation />
      </NotificationProvider>
    </AuthProvider>
  );
}
