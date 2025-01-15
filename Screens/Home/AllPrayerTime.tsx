import React from "react";
import { View, Text, StyleSheet } from "react-native";
import prayerSchedule from "../Data/PrayerTimeData";

const PrayerTimesDisplay = () => {
  // Function to format time to 12-hour format with AM/PM
  const formatTime = (time24: string) => {
    const [hours, minutes] = time24.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Function to check if current time is within 15 minutes of prayer time
  const isCurrentPrayer = (timeStr: string) => {
    const now = new Date();
    const [hours, minutes] = timeStr.split(":");
    const prayerTime = new Date();
    prayerTime.setHours(parseInt(hours), parseInt(minutes));

    const diff = Math.abs(now.getTime() - prayerTime.getTime());
    return diff <= 15 * 60 * 1000; // 15 minutes in milliseconds
  };

  const prayerNames = {
    subuh: "Fajr",
    zohor: "Dhuhr",
    asar: "Asr",
    maghrib: "Maghrib",
    isyak: "Isha",
  };

  return (
    <View style={styles.container}>
      {Object.entries(prayerSchedule).map(([key, time], index, array) => (
        <View
          key={key}
          style={[
            styles.prayerRow,
            index !== array.length - 1 && styles.borderBottom,
          ]}
        >
          <View style={styles.leftContent}>
            <View
              style={[
                styles.circle,
                isCurrentPrayer(time) && styles.activeCircle,
              ]}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.prayerName}>
                {prayerNames[key as keyof typeof prayerNames]}
              </Text>
              <Text style={styles.subtitle}>
                {isCurrentPrayer(time) ? "Adhan Al Hossaini" : "Sound off"}
              </Text>
            </View>
          </View>
          <Text style={styles.time}>{formatTime(time)}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  prayerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    marginRight: 12,
  },
  activeCircle: {
    backgroundColor: "#22c55e",
    borderColor: "#22c55e",
  },
  nameContainer: {
    marginLeft: 4,
  },
  prayerName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  time: {
    fontSize: 14,
    color: "#666",
  },
});

export default PrayerTimesDisplay;
