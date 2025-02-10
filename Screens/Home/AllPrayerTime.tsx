import React from "react";
import { View, Text, ScrollView } from "react-native";

interface PrayerTimesDisplayProps {
  prayerTimes: {
    Fajr: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
  };
}

const PrayerTimesDisplay: React.FC<PrayerTimesDisplayProps> = ({
  prayerTimes,
}) => {
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

  const isCurrentPrayer = (timeStr: string) => {
    const now = new Date();
    const [hours, minutes] = timeStr.split(":");
    const prayerTime = new Date();
    prayerTime.setHours(parseInt(hours), parseInt(minutes));

    const sortedPrayers = Object.values(prayerTimes)
      .map((time) => {
        const [h, m] = time.split(":");
        const pTime = new Date();
        pTime.setHours(parseInt(h), parseInt(m));
        return pTime;
      })
      .sort((a, b) => a.getTime() - b.getTime());

    const nextPrayerTime = sortedPrayers.find(
      (prayer) => prayer.getTime() >= now.getTime()
    );

    return prayerTime.getTime() === nextPrayerTime?.getTime();
  };

  const prayerNames = {
    Fajr: "Fajr",
    Dhuhr: "Dhuhr",
    Asr: "Asr",
    Maghrib: "Maghrib",
    Isha: "Isha",
  };

  return (
    <View
      style={{
        margin: 10,
        backgroundColor: "white",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      {Object.entries(prayerTimes).map(([key, time], index) => (
        <View
          key={key}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderBottomWidth:
              index < Object.keys(prayerTimes).length - 1 ? 1 : 0,
            borderBottomColor: "#f0f0f0",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
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
            <View>
              <Text style={{ fontSize: 16, fontWeight: "500", color: "#333" }}>
                {prayerNames[key as keyof typeof prayerNames]}
              </Text>
              <Text style={{ fontSize: 12, color: "#666" }}>
                {isCurrentPrayer(time) ? "Adhan Al Hossaini" : "Sound off"}
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 14, color: "#666" }}>
            {formatTime(time)}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default PrayerTimesDisplay;
