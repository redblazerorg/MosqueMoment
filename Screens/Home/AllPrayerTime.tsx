import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import prayerSchedule from "../Model/PrayerTimeData";

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

  const height = Dimensions.get("window").height;

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
    <View
      style={{
        margin: 10,
        // height: height * 0.35,
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
        display: "flex",
        // height: 200,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.entries(prayerSchedule).map(([key, time], index, array) => (
          <View
            key={key}
            style={[
              {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                // paddingVertical: 12,
                paddingBottom: 5,
              },
              index !== array.length - 1 && {
                // borderBottomWidth: 1,
                borderBottomColor: "#f0f0f0",
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={[
                  {
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: "#e0e0e0",
                    marginRight: 12,
                  },
                  isCurrentPrayer(time) && {
                    backgroundColor: "#22c55e",
                    borderColor: "#22c55e",
                  },
                ]}
              />
              <View
                style={{
                  marginLeft: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  {prayerNames[key as keyof typeof prayerNames]}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#666",
                    marginTop: 2,
                  }}
                >
                  {isCurrentPrayer(time) ? "Adhan Al Hossaini" : "Sound off"}
                </Text>
              </View>
            </View>
            <Text
              style={{
                fontSize: 14,
                color: "#666",
              }}
            >
              {formatTime(time)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default PrayerTimesDisplay;
