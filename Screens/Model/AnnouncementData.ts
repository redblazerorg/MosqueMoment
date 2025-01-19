import { ImageSourcePropType } from "react-native";

interface Announcement {
  title: string;
  date: Date;
  description: string;
}

export interface Activity {
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
}

interface MosqueDetails {
  id: number;
  mosque: string;
  picture: ImageSourcePropType | undefined;
  description: string;
  mosqueLat: number;
  mosqueLong: number;
  announcement: Announcement[];
  activity: Activity[];
  isSubscribe: boolean;
}

export default MosqueDetails;
