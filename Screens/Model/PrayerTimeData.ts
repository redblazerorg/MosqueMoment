interface PrayerSchedule {
  [key: string]: string; // HH:mm format
}

const prayerSchedule: PrayerSchedule = {
  subuh: "05:00",
  zohor: "13:05",
  asar: "16:15",
  maghrib: "19:20",
  isyak: "20:35",
};

export default prayerSchedule;
