import { ImageSourcePropType } from "react-native";

interface Announcement {
  title: string;
  date: Date;
  description: string;
}

interface MosqueDetails {
  id: number;
  mosque: string;
  picture: ImageSourcePropType | undefined;
  description: string;
  mosqueLat: number;
  mosqueLong: number;
  announcement: Announcement[];
  isSubscribe: boolean;
}

export default MosqueDetails;
