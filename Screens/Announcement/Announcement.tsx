import React from "react";
import { AnnouncementProvider } from "../Context/AnnouncementContext";

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

type NavigationProp = NativeStackNavigationProp<AnnouncementStackParamList>;

const Announcement = () => {
  const { mosqueDetails } = useAnnouncements();
  const height = Dimensions.get("window").height;

  const navigation = useNavigation<NavigationProp>();

  // Filter the mosques where isSubscribe is true
  const subscribedMosques = mosqueDetails.filter(
    (mosque) => mosque.isSubscribe
  );

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
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                {mosque.mosque}
              </Text>
              {mosque.announcement.map((announcement, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    {announcement.title}
                  </Text>
                  <Text style={{ fontSize: 14, color: "gray" }}>
                    {announcement.date.toLocaleDateString()} -{" "}
                    {announcement.date.toLocaleTimeString()}
                  </Text>
                  <Text style={{ fontSize: 14 }}>
                    {announcement.description}
                  </Text>
                </View>
              ))}
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
