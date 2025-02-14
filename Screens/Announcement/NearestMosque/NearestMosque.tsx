import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import {
  MosqueDetails,
  useAnnouncements,
} from "../../Context/AnnouncementContext";

const MosqueLocation = () => {
  // States
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [openFloatingLocation, setOpenFloatingLocation] =
    useState<boolean>(false);
  const [selectedMosque, setSelectedMosque] = useState<MosqueDetails | null>(
    null
  );

  // Context and refs
  const { mosqueDetails, subscribe } = useAnnouncements();
  const mapRef = useRef<MapView>(null);
  const { width, height } = Dimensions.get("window");

  // Get current location
  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  // Navigation functions
  const navigateToLocation = (latitude: number, longitude: number) => {
    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  };

  const handleAvailableLocation = () => {
    setOpenFloatingLocation(!openFloatingLocation);
    if (openSheet) setOpenSheet(false);
  };

  const handleMarkerPress = (mosque: MosqueDetails) => {
    setSelectedMosque(mosque);
    setOpenSheet(true);
  };

  const CustomMarker = ({ mosque }: { mosque: MosqueDetails }) => {
    return (
      <Marker
        coordinate={{
          latitude: mosque.mosqueLat,
          longitude: mosque.mosqueLong,
        }}
        onPress={() => handleMarkerPress(mosque)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={
          location
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
            : undefined
        }
        showsUserLocation={true}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />
        )}
        {mosqueDetails.map((mosque) => (
          <CustomMarker key={mosque.id} mosque={mosque} />
        ))}
      </MapView>

      {/* Available Locations Button */}
      <View style={styles.topButton}>
        <TouchableOpacity onPress={handleAvailableLocation}>
          <Text>Available Mosques</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <View
        style={[styles.bottomSheet, { height: openSheet ? height * 0.9 : 0 }]}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setOpenSheet(false)}
        >
          <Ionicons name="close" size={30} />
        </TouchableOpacity>

        {selectedMosque && (
          <View style={styles.mosqueDetails}>
            <Text style={styles.sheetTitle}>{selectedMosque.mosque}</Text>
            <TouchableOpacity
              onPress={() =>
                navigateToLocation(
                  selectedMosque.mosqueLat,
                  selectedMosque.mosqueLong
                )
              }
            >
              <Text style={styles.sheetContent}>
                {selectedMosque.description}
              </Text>

              <View style={styles.activitySection}>
                <Text style={styles.sectionTitle}>Activities:</Text>
                {selectedMosque.activities.map((activity) => (
                  <View key={activity.id} style={styles.activityItem}>
                    <Text style={styles.activityName}>
                      {activity.activityName}
                    </Text>
                    <Text>Type: {activity.activityType}</Text>
                    <Text>
                      Time: {activity.startTime} - {activity.endTime}
                    </Text>
                  </View>
                ))}
              </View>

              <Button
                title={selectedMosque.isSubscribe ? "Unsubscribe" : "Subscribe"}
                onPress={() => subscribe(selectedMosque.id)}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Floating Location Card */}
      {openFloatingLocation && (
        <View style={styles.floatingCard}>
          <Text style={styles.cardText}>Nearby Mosques</Text>
          {mosqueDetails.map((mosque) => (
            <TouchableOpacity
              key={mosque.id}
              onPress={() => {
                navigateToLocation(mosque.mosqueLat, mosque.mosqueLong);
              }}
              style={styles.mosqueItem}
            >
              <Text>{mosque.mosque}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  topButton: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
  },
  bottomSheet: {
    position: "absolute",
    backgroundColor: "whitesmoke",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
  },
  closeButton: {
    alignSelf: "flex-end",
    width: 60,
    height: 30,
    alignItems: "center",
  },
  mosqueDetails: {
    padding: 20,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sheetContent: {
    fontSize: 16,
    marginBottom: 20,
  },
  activitySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  activityItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  activityName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  floatingCard: {
    position: "absolute",
    top: 60,
    right: 0,
    left: 0,
    backgroundColor: "white",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  mosqueItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

export default MosqueLocation;
