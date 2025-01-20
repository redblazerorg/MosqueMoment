import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useAnnouncements } from "../Context/AnnouncementContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  AnnouncementStackParamList,
  RootStackParamList,
} from "../../navigations/AppNavigation";
// import ActivityTable from "./MosqueAvailable/ActivityTable";
import { SafeAreaView } from "react-native-safe-area-context";
import ActivityTable from "./MosqueAvailable/ActivityTable";
import { Activity } from "../Model/AnnouncementData"; // Import the Activity type from your model

type NavigationProp = NativeStackNavigationProp<AnnouncementStackParamList>;

const Announcement = () => {
  const { mosqueDetails } = useAnnouncements();
  const height = Dimensions.get("window").height;
  const navigation = useNavigation<NavigationProp>();

  const lastScrollY = useRef(0);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  // Convert the activity data to match the expected type
  const convertActivity = (activity: any): Activity => {
    return {
      id: activity.id || Date.now(), // Generate an ID if not provided
      mosqueName: activity.mosqueName || "", // Add mosque name
      activityName: activity.title || activity.activityName, // Handle both old and new property names
      date: new Date(activity.date),
      startTime: activity.startTime,
      endTime: activity.endTime,
      createdAt: activity.createdAt || new Date(), // Add creation date
    };
  };

  // Filter subscribed mosques and convert activities
  const subscribedMosques = mosqueDetails
    .filter((mosque) => mosque.isSubscribe)
    .map((mosque) => ({
      ...mosque,
      activity: mosque.activities?.map(convertActivity) || [], // Convert activities to match expected type
    }));

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const { contentSize, layoutMeasurement } = event.nativeEvent;

    // Check if we're at the bottom
    const isAtBottom =
      layoutMeasurement.height + currentScrollY >= contentSize.height - 20;

    // Determine scroll direction
    const isMovingUp = currentScrollY < lastScrollY.current;

    // Update button visibility based on conditions
    if (currentScrollY <= 0) {
      // At the top
      // setIsButtonVisible(false);
    } else if (isAtBottom) {
      // At the bottom
      setIsButtonVisible(false);
    } else {
      // Show button only when scrolling up
      setIsButtonVisible(isMovingUp);
    }

    // Update last scroll position
    lastScrollY.current = currentScrollY;
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;

    // Check if we're at the bottom when scrolling ends
    const isAtBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isAtBottom) {
      setIsButtonVisible(false);
    }
  };

  return (
    <SafeAreaView>
      <View
        style={{
          height: height * 0.85,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
          style={{ padding: 20 }}
          scrollEventThrottle={16}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
            Announcement
          </Text>

          {subscribedMosques.length === 0 ? (
            <View>
              <Text>No subscribed mosques available.</Text>
              <View
                style={{
                  backgroundColor: "#66C266",
                  borderRadius: 12,
                  padding: 10,
                  width: 100,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("MosqueAvailable");
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    Mosque
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            subscribedMosques.map((mosque) => (
              <View key={mosque.id} style={{ marginBottom: 20 }}>
                <Text
                  style={{ fontSize: 20, marginBottom: 10, fontWeight: "bold" }}
                >
                  {mosque.mosque}
                </Text>
                {mosque.announcement.map((announcement, index) => (
                  <View key={index} style={{ marginBottom: 10 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        marginBottom: 5,
                      }}
                    >
                      {announcement.title}
                    </Text>
                    <Text style={{ fontSize: 14, color: "gray" }}>
                      {announcement.date.toLocaleDateString()} -{" "}
                      {announcement.date.toLocaleTimeString()}
                    </Text>
                    <Text style={{ fontSize: 14 }}>
                      {announcement.description}
                    </Text>
                    <View
                      style={{
                        marginTop: 5,
                        height: 2,
                        backgroundColor: "rgb(209, 209, 209)",
                      }}
                    ></View>
                  </View>
                ))}
                {mosque.activity.length !== 0 && (
                  <View>
                    <Text
                      style={{
                        marginTop: 5,
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Activities
                    </Text>
                    <ActivityTable activities={mosque.activity} />
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
        {isButtonVisible && (
          <View
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "#66C266",
              borderRadius: 12,
              padding: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("MosqueAvailable");
              }}
            >
              <Text style={{ color: "white" }}>Mosque</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Announcement;
