import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from "@react-navigation/native";
import { ViewStyle, ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../Screens/Context/AuthContext";
import { AnnouncementProvider } from "../Screens/Context/AnnouncementContext";

import HomeAdmin from "../Screens/Admin/Home";
import ActivityAdmin from "../Screens/Admin/ActivityAdmin";
import AnnouncementAdmin from "../Screens/Admin/AnnouncementAdmin";

import Home from "../Screens/Home/Home";
import Splash from "../Screens/Splash";
import Announcement from "../Screens/Announcement/Announcement";
import MosqueAvailable from "../Screens/Announcement/MosqueAvailable/MosqueAvailable";
import MosqueDetail from "../Screens/Announcement/MosqueAvailable/MosqueDetail";
import MosqueDetails from "../Screens/Model/AnnouncementData";
import QiblaCompass from "../Screens/Qibla/QiblaDirection";
import SignIn from "../Screens/Auth/SignIn";
import SignUp from "../Screens/Auth/SignUp";
import ForgotPassword from "../Screens/Auth/ForgotPassword";
import Profile from "../Screens/Profile/Profile";

export type RootStackParamList = {
  Splash: undefined;
  AdminMain: undefined;
  Main: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Profile: undefined;
};

export type RootAdminTabParamList = {
  Home: undefined;
  Activity: undefined;
  Announcement: undefined;
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
const AdminTab = createBottomTabNavigator<RootAdminTabParamList>();

const ProfileWithAnnouncement = ({ navigation }: { navigation: any }) => {
  return (
    <AnnouncementProvider>
      <Profile navigation={navigation}/>
    </AnnouncementProvider>
  );
};

const ActivityAdminWithAnnouncement = () => {
  return (
    <AnnouncementProvider>
      <ActivityAdmin />
    </AnnouncementProvider>
  );
};

//each its own stack with wrapped context
const AnnouncementStack =
  createNativeStackNavigator<AnnouncementStackParamList>();

  // Create Announcement Stack Navigator for Admin
  const AnnouncementNavigatorAdmin = () => {
    return (
      <AnnouncementProvider>
        <AnnouncementStack.Navigator>
          <AnnouncementStack.Screen
            name="AnnouncementMain"
            component={AnnouncementAdmin}
            options={{ headerShown: false }}
          />
        </AnnouncementStack.Navigator>
      </AnnouncementProvider>
    );
  };

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

// Define a Admin Tab navigator component
const AdminTabNavigator = () => {
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
    <AdminTab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#66C266",
        tabBarInactiveTintColor: "#999999",
        tabBarStyle: tabBarStyle,
      })}
    >
      <AdminTab.Screen
        name="Home"
        component={HomeAdmin} // You'll need to create this component
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <AdminTab.Screen
        name="Activity"
        component={ActivityAdminWithAnnouncement}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="extension-puzzle" color={color} size={size} />
          ),
        }}
      />
      <AdminTab.Screen
        name="Announcement"
        component={AnnouncementNavigatorAdmin}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" color={color} size={size} />
          ),
        }}
      />
      {/* Add more admin screens as needed */}
    </AdminTab.Navigator>
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
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
      {!isAuthenticated ? (
        <>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{
              headerShown: false,
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{
              headerShown: false,
            }}
          />

          {user?.role === 'admin' ? (
            <Stack.Screen
                name="AdminMain"
                component={AdminTabNavigator}
                options={{
                  headerShown: false,
                }}
              />
          ) : (
            <Stack.Screen
              name="Main"
              component={TabNavigator}
              options={{
                headerShown: false,
              }}
            />
          )}

          <Stack.Screen
            name="Profile"
            component={ProfileWithAnnouncement}
            options={{
              headerShown: false,
            }}
          />
        </>
      )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;