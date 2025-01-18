import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from "@react-navigation/native";
import Home from "../Screens/Home/Home";
import Splash from "../Screens/Splash";
import Announcement from "../Screens/Announcement/Announcement";
import { Ionicons } from "@expo/vector-icons";
import MosqueAvailable from "../Screens/Announcement/MosqueAvailable/MosqueAvailable";
import { AnnouncementProvider } from "../Screens/Context/AnnouncementContext";
import { ViewStyle } from "react-native";
import MosqueDetail from "../Screens/Announcement/MosqueAvailable/MosqueDetail";
import MosqueDetails from "../Screens/Model/AnnouncementData";
import QiblaCompass from "../Screens/Qibla/QiblaDirection";

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
};

export type RootTabParamList = {
  Home: undefined;
  Announcement: undefined;
  Qibla: undefined;
};

export type AnnouncementStackParamList = {
  AnnouncementMain: undefined;
  MosqueAvailable: undefined;
  MosqueDetail: {
    mosqueSelected: MosqueDetails;
  };
};

// Create the stack and tab navigators
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

//each its own stack with wrapped context
const AnnouncementStack =
  createNativeStackNavigator<AnnouncementStackParamList>();

// Create Announcement Stack Navigator
const AnnouncementNavigator = () => {
  return (
    <AnnouncementProvider>
      <AnnouncementStack.Navigator>
        <AnnouncementStack.Screen
          name="AnnouncementMain"
          component={Announcement}
          options={{ headerShown: false }}
        />
        <AnnouncementStack.Screen
          name="MosqueAvailable"
          component={MosqueAvailable}
          options={{ headerShown: false }}
        />
        <AnnouncementStack.Screen
          name="MosqueDetail"
          component={MosqueDetail}
          options={{ headerShown: false }}
        />
      </AnnouncementStack.Navigator>
    </AnnouncementProvider>
  );
};

// Define a Tab navigator component
const TabNavigator = () => {
  const tabBarStyle: ViewStyle = {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    height: 60,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 30,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    overflow: "hidden",
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#66C266",
        tabBarInactiveTintColor: "#999999",
        tabBarStyle: ((route) => {
          const routeName = getFocusedRouteNameFromRoute(route);
          const hiddenRoutes = ["MosqueAvailable", "MosqueDetail"];
          return hiddenRoutes.includes(routeName || "")
            ? { display: "none" }
            : tabBarStyle;
        })(route),
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Announcement"
        component={AnnouncementNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Qibla"
        component={QiblaCompass}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
