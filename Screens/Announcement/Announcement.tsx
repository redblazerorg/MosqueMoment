import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useAnnouncements } from "../Context/AnnouncementContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  AnnouncementStackParamList,
  RootStackParamList,
} from "../../navigations/AppNavigation";
import ActivityTable from "./MosqueAvailable/ActivityTable";
import { Activity } from "../Model/AnnouncementData"; // Import the Activity type from your model

type NavigationProp = NativeStackNavigationProp<AnnouncementStackParamList>;

const Announcement = () => {
  const { mosqueDetails } = useAnnouncements();
  const height = Dimensions.get("window").height;
  const navigation = useNavigation<NavigationProp>();

  // Convert the activity data to match the expected type
  const convertActivity = (activity: any): Activity => {
    return {
      id: activity.id || Date.now(), // Generate an ID if not provided
      mosqueName: activity.mosqueName || '', // Add mosque name
      activityName: activity.title || activity.activityName, // Handle both old and new property names
      date: new Date(activity.date),
      startTime: activity.startTime,
      endTime: activity.endTime,
      createdAt: activity.createdAt || new Date() // Add creation date
    };
  };

  // Filter subscribed mosques and convert activities
  const subscribedMosques = mosqueDetails.filter(
    (mosque) => mosque.isSubscribe
  ).map(mosque => ({
    ...mosque,
    activity: mosque.activities?.map(convertActivity) || [] // Convert activities to match expected type
  }));

  return (
    <View
      style={{
        height: height * 0.85,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
          Announcement
        </Text>

        {subscribedMosques.length === 0 ? (
          <Text>No subscribed mosques available.</Text>
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
                    {new Date(announcement.date).toLocaleDateString()} -{" "}
                    {new Date(announcement.date).toLocaleTimeString()}
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
      </ScrollView>
    </View>
  );
};

export default Announcement;