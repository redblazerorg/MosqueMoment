import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { RouteProp, useRoute } from "@react-navigation/native";
import MosqueDetails from "../../Model/AnnouncementData";

type MosqueDetailParams = {
  mosqueSelected: MosqueDetails;
};

// Define type for route.params
type RootStackParamList = {
  MosqueDetail: MosqueDetailParams;
};

const MosqueDetail = () => {
  // Type the route
  const route = useRoute<RouteProp<RootStackParamList, "MosqueDetail">>();
  const { mosqueSelected } = route.params; // No more errors!
  const {
    mosqueLat: latitude,
    mosqueLong: longitude,
    picture,
    description,
    mosque,
  } = mosqueSelected;

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    // Animate to the selected mosque's location when the component mounts
    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000 // duration in milliseconds
    );
  }, [latitude, longitude]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      {/* Mosque Image */}
      <Image
        source={picture}
        style={{
          width: "100%",
          height: 200,
        }}
        resizeMode="cover"
      />

      {/* Map Card */}
      <View
        style={{
          marginHorizontal: 16,
          marginTop: -50,
          backgroundColor: "#fff",
          borderRadius: 12,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
          overflow: "hidden",
        }}
      >
        <MapView
          ref={mapRef}
          style={{
            height: 150,
            width: "100%",
          }}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={{ latitude, longitude }} title={mosque} />
        </MapView>
        <View
          style={{
            padding: 12,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 4,
            }}
          >
            {mosque}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#666",
            }}
          >
            Latitude: {latitude.toFixed(6)}, Longitude: {longitude.toFixed(6)}
          </Text>
        </View>
      </View>

      {/* Description Section */}
      <View
        style={{
          marginHorizontal: 16,
          marginTop: 16,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 8,
            color: "#009688",
          }}
        >
          Deskripsi
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#333",
            lineHeight: 20,
          }}
        >
          {description}
        </Text>
      </View>
    </View>
  );
};

export default MosqueDetail;
