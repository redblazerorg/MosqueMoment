import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import axios from "axios";
import moment from "moment-hijri";
import { PrayerTimesResponse } from "../Model/PrayerTimeModel";
import { getPrayerTimesByCity } from "../Service/api";
// import { getPrayerTimesByCity } from "../api/prayerTimes";

interface PrayerTimesProps {
  prayerTimes: { [key: string]: string };
}

const PrayerTimes: React.FC<PrayerTimesProps> = ({ prayerTimes }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [currentPrayer, setCurrentPrayer] = useState<string>("");
  const [nextPrayer, setNextPrayer] = useState<string>("");
  const [minutesUntilNext, setMinutesUntilNext] = useState<string>("");

  const timeStringToDate = (timeStr: string): Date => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0);
    return date;
  };

  const getHoursAndMinutesBetween = (startTime: Date, endTime: Date) => {
    const differenceInMillis = endTime.getTime() - startTime.getTime();
    const totalMinutes = Math.floor(differenceInMillis / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let timeDifference = "";
    if (hours > 0) {
      timeDifference += `${hours} hour${hours > 1 ? "s" : ""}`;
    }
    if (minutes > 0) {
      if (timeDifference) timeDifference += " ";
      timeDifference += `${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
    return timeDifference || "0 minutes";
  };

  const updatePrayerTimes = (): void => {
    const now = currentTime;
    const times = Object.entries(prayerTimes).map(([name, time]) => ({
      name,
      time: timeStringToDate(time),
    }));

    times.sort((a, b) => a.time.getTime() - b.time.getTime());

    let current = times[times.length - 1];
    let next = times[0];

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

    if (now > times[times.length - 1].time) {
      current = times[times.length - 1];
      next = times[0];
      next.time.setDate(next.time.getDate() + 1);
    }

    setCurrentPrayer(current.name);
    setNextPrayer(next.name);
    setMinutesUntilNext(getHoursAndMinutesBetween(now, next.time));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (Object.keys(prayerTimes).length > 0) {
      updatePrayerTimes();
    }
  }, [currentTime, prayerTimes]);

  const hijriDate = moment().format("iDD iMMMM iYYYY [AH]");
  const todayDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });

  return (
    <View style={{ padding: 20, borderRadius: 10, marginVertical: 30 }}>
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
        <Text style={{ color: "white", fontSize: 16, marginBottom: 5 }}>
          {nextPrayer}
        </Text>
        <View
          style={{
            borderRadius: 20,
            backgroundColor: "white",
            opacity: 0.7,
            padding: 5,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {minutesUntilNext}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PrayerTimes;
