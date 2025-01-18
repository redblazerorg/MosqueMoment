import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useAnnouncements } from "../../Context/AnnouncementContext";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { AnnouncementStackParamList } from "../../../navigations/AppNavigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<AnnouncementStackParamList>;

const MosqueAvailable = () => {
  const { subscribe, filteredMosqueDetails, searchMosque } = useAnnouncements();
  const width = Dimensions.get("window").width;
  const navigation = useNavigation<NavigationProp>();

  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = (text: string) => {
    setSearchKeyword(text);
    searchMosque(text);
  };

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 10,
      }}
    >
      <TextInput
        style={{
          height: 50,
          borderColor: "#ccc",
          backgroundColor: "white",
          borderWidth: 1,
          borderRadius: 8,
          marginTop: 50,
          marginBottom: 20,
          paddingHorizontal: 10,
        }}
        placeholder="Search for a mosque..."
        value={searchKeyword}
        onChangeText={handleSearch}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredMosqueDetails.map((mosque, index) => (
          <View
            key={index}
            style={{
              backgroundColor: "#fff",
              borderRadius: 8,
              padding: 10,
              marginVertical: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("MosqueDetail", {
                  mosqueSelected: mosque,
                });
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#333",
                      marginBottom: 5,
                    }}
                  >
                    {mosque.mosque}
                  </Text>
                  <Text numberOfLines={6}>{mosque.description}</Text>
                </View>
                <Image
                  source={mosque.picture}
                  style={{
                    width: width * 0.4,
                    height: 150,
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                />
              </View>

              <TouchableOpacity onPress={() => subscribe(mosque.id)}>
                <View
                  style={{
                    borderRadius: 12,
                    backgroundColor: "#66C266",
                    width: 90,

                    padding: 2,
                  }}
                >
                  <Text style={{ textAlign: "center", color: "white" }}>
                    {mosque.isSubscribe ? "Unsubscribe" : "Subscribe"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* <Text
                style={{
                  fontSize: 14,
                  color: "#666",
                }}
              >
                Latitude: {mosque.mosqueLat}, Longitude: {mosque.mosqueLong}
              </Text> */}
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default MosqueAvailable;
