import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import prayerSchedule from "../Data/PrayerTimeData";
import moment from "moment-hijri";

interface PrayerTime {
  name: string;
  time: Date;
}

const PrayerTimes: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [currentPrayer, setCurrentPrayer] = useState<string>("");
  const [nextPrayer, setNextPrayer] = useState<string>("");
  const [minutesUntilNext, setMinutesUntilNext] = useState<string>("");

  //Date
  const hijriDate = moment().format("iDD iMMMM iYYYY [AH]");
  const date = new Date();

  const todayDate = date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });

  // Convert time string to Date object
  const timeStringToDate = (timeStr: string): Date => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0);
    return date;
  };

  // Calculate minutes between two times
  const getMinutesBetween = (time1: Date, time2: Date): number => {
    const diff = time2.getTime() - time1.getTime();
    return Math.floor(diff / 1000 / 60);
  };

  function getHoursAndMinutesBetween(startTime: Date, endTime: Date) {
    const differenceInMillis = endTime.getTime() - startTime.getTime(); // Difference in milliseconds
    const totalMinutes = Math.floor(differenceInMillis / (1000 * 60)); // Convert milliseconds to minutes

    const hours = Math.floor(totalMinutes / 60); // Get hours
    const minutes = totalMinutes % 60; // Get remaining minutes

    let timeDifference = "";

    if (hours > 0) {
      timeDifference += `${hours} hour${hours > 1 ? "s" : ""}`;
    }

    if (minutes > 0) {
      if (timeDifference) timeDifference += " ";
      timeDifference += `${minutes} minute${minutes > 1 ? "s" : ""}`;
    }

    return timeDifference || "0 minutes";
  }

  // Determine current and next prayer times
  const updatePrayerTimes = (): void => {
    const now = currentTime;
    const times: PrayerTime[] = Object.entries(prayerSchedule).map(
      ([name, time]) => ({
        name,
        time: timeStringToDate(time),
      })
    );

    // Sort prayer times chronologically
    times.sort((a, b) => a.time.getTime() - b.time.getTime());

    // Find current and next prayer
    let current: PrayerTime = times[times.length - 1];
    let next: PrayerTime = times[0];

    for (let i = 0; i < times.length; i++) {
      if (now < times[i].time) {
        if (i === 0) {
          current = times[times.length - 1];
        } else {
          current = times[i - 1];
        }
        next = times[i];
        break;
      }
    }

    // If we're past the last prayer of the day
    if (now > times[times.length - 1].time) {
      current = times[times.length - 1];
      next = times[0];
      // Add 24 hours to next prayer time for correct calculation
      next.time.setDate(next.time.getDate() + 1);
    }

    setCurrentPrayer(current.name);
    setNextPrayer(next.name);
    setMinutesUntilNext(getHoursAndMinutesBetween(now, next.time));
  };

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Update prayer times whenever current time changes
  useEffect(() => {
    updatePrayerTimes();
  }, [currentTime]);

  return (
    <View
      style={{
        padding: 20,
        // backgroundColor: "#f5f5f5",
        borderRadius: 10,
        marginVertical: 30,
        marginHorizontal: 10,
      }}
    >
      <View style={{ display: "flex", alignItems: "center" }}>
        <Text style={{ color: "whitesmoke", fontSize: 20, fontWeight: "bold" }}>
          {todayDate}
        </Text>
        <Text style={{ fontSize: 18, fontWeight: "semibold" }}>
          {hijriDate}
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginVertical: 20,
            color: "whitesmoke",
          }}
        >
          {currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        {/* <Text
          style={{
            fontSize: 16,
            marginBottom: 5,
          }}
        >
          Current Prayer:{" "}
          {currentPrayer.charAt(0).toUpperCase() + currentPrayer.slice(1)}
        </Text> */}
        <Text
          style={{
            color: "white",
            fontSize: 16,
            marginBottom: 5,
          }}
        >
          {nextPrayer.charAt(0).toUpperCase() + nextPrayer.slice(1)}
        </Text>
        <View
          style={{
            borderRadius: 20,
            backgroundColor: "white",
            opacity: 0.7,
            padding: 5,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {minutesUntilNext}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PrayerTimes;
