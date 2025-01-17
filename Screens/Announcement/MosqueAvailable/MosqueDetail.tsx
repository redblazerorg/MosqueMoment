import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { RouteProp, useRoute } from "@react-navigation/native";

type MosqueDetailParams = {
  latitude: number;
  longitude: number;
  mosqueName: string;
};

// Define type for route.params
type RootStackParamList = {
  MosqueDetail: MosqueDetailParams;
};

const MosqueDetail = () => {
  // Type the route
  const route = useRoute<RouteProp<RootStackParamList, "MosqueDetail">>();
  const { latitude, longitude, mosqueName } = route.params; // No more errors!

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
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={{ latitude, longitude }} title={mosqueName} />
      </MapView>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{mosqueName}</Text>
        <Text style={styles.coordinates}>
          Latitude: {latitude.toFixed(6)}, Longitude: {longitude.toFixed(6)}
        </Text>
      </View>
    </View>
  );
};

export default MosqueDetail;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  coordinates: {
    fontSize: 14,
    color: "#666",
  },
});
