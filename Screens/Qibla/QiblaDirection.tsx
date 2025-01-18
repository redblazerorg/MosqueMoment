import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Platform } from "react-native";
import { Magnetometer } from "expo-sensors";
import * as Location from "expo-location";

const QiblaCompass: React.FC = () => {
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [phoneHeading, setPhoneHeading] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Request location permission and get user's location
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMessage("Location permission denied.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const angle = calculateQibla(latitude, longitude);
      setQiblaAngle(angle);
    };

    // Subscribe to Magnetometer updates
    const subscribeToMagnetometer = () => {
      Magnetometer.addListener(({ x, y }) => {
        const heading = Math.atan2(y, x) * (180 / Math.PI);
        const normalizedHeading = (heading + 360) % 360; // Normalize to 0-360
        setPhoneHeading(normalizedHeading);
      });

      return () => Magnetometer.removeAllListeners();
    };

    getLocation();
    const magnetometerSubscription = subscribeToMagnetometer();

    return () => {
      // Cleanup Magnetometer subscription
      magnetometerSubscription();
    };
  }, []);

  const calculateQibla = (lat: number, lon: number): number => {
    // Coordinates of the Kaaba
    const kaabaLat = 21.4225;
    const kaabaLon = 39.8262;

    // Convert degrees to radians
    const rad = (deg: number) => (deg * Math.PI) / 180;

    // Calculate differences
    const dLon = rad(kaabaLon - lon);
    const lat1 = rad(lat);
    const lat2 = rad(kaabaLat);

    // Bearing formula
    const x = Math.sin(dLon) * Math.cos(lat2);
    const y =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    let bearing = Math.atan2(x, y);

    // Convert bearing from radians to degrees
    bearing = (bearing * 180) / Math.PI;

    // Normalize bearing to 0-360
    return (bearing + 360) % 360;
  };

  // Calculate the angle to rotate the arrow
  const rotation =
    qiblaAngle !== null ? (qiblaAngle - phoneHeading + 360) % 360 : 0;

  return (
    <View style={styles.container}>
      {qiblaAngle !== null ? (
        <>
          <Text style={styles.text}>
            Qibla Direction: {qiblaAngle.toFixed(2)}°
          </Text>
          <View style={styles.compass}>
            <Image
              source={require("../../assets/arrow.webp")} // Replace with your arrow image
              style={[
                styles.arrow,
                { transform: [{ rotate: `${rotation}deg` }] },
              ]}
            />
          </View>
        </>
      ) : errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : (
        <Text style={styles.text}>Calculating Qibla Direction...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginHorizontal: 20,
  },
  compass: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#000",
  },
  arrow: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});

export default QiblaCompass;
