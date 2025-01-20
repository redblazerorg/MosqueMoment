import { ImageSourcePropType } from "react-native";

export interface Activity {
  id: number;
  mosqueName: string;
  activityName: string;
  date: Date;
  startTime: string;
  endTime: string;
  createdAt: Date;
}

export interface Announcement {
  id: number;
  title: string;
  description: string;
  date: Date;
  mosqueName: string;
  createdAt: Date;
}

export interface Activity {
  title: string;
  date: Date;
  description: string;
  date: Date;
  mosqueName: string;
  createdAt: Date;
}

interface MosqueDetails {
  id: number;
  mosque: string;
  picture: ImageSourcePropType | string | undefined;
  description: string;
  mosqueLat: number;
  mosqueLong: number;
  announcement: Announcement[];
  activities: Activity[]; // Changed from activity to activities to match context
  isSubscribe: boolean;
  adminId?: string;
}

export default MosqueDetails;
