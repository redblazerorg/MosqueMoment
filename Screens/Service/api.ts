import axios from "axios";
import { PrayerTimesResponse } from "../Model/PrayerTimeModel";

const BASE_URL = "https://api.aladhan.com/v1";

// Function to fetch prayer times by city
export const getPrayerTimesByCity = async (
  city: string,
  country: string,
  method: number = 2
): Promise<PrayerTimesResponse | null> => {
  try {
    const response = await axios.get<PrayerTimesResponse>(
      `${BASE_URL}/timingsByCity?city=${city}&country=${country}&method=${method}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    return null;
  }
};

// Function to fetch prayer times by coordinates
export const getPrayerTimesByCoordinates = async (
  latitude: number,
  longitude: number,
  method: number = 2
): Promise<PrayerTimesResponse | null> => {
  try {
    const response = await axios.get<PrayerTimesResponse>(
      `${BASE_URL}/timings?latitude=${latitude}&longitude=${longitude}&method=${method}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    return null;
  }
};
