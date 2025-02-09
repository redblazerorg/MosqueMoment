import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { useAuth } from "../Context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNotifications } from './NotificationContext';
// import MosqueDetails from "../Model/AnnouncementData";

export enum MosqueActivity {
  ForumPerdana = "Forum Perdana",
  Qiyamullail = "Qiyamullail",
  MajlisIlmu = "Majlis Ilmu",
  SolatHajat = "Solat Hajat",
  KuliahSubuh = "Kuliah Subuh",
  GotongRoyong = "Gotong Royong",
}

// Types for activities and announcements
export type Activity = {
  id: number;
  mosqueName: string;
  activityName: string;
  date: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  createdAt: Date;
  picture: any;
  activityType: MosqueActivity;
};

export type Announcement = {
  id: number;
  title: string;
  description: string;
  date: Date;
  mosqueName: string;
  createdAt: Date;
};

export type MosqueDetails = {
  id: number;
  mosque: string;
  picture: any;
  description: string;
  mosqueLat: number;
  mosqueLong: number;
  announcement: Announcement[];
  activities: Activity[];
  isSubscribe: boolean;
  adminId?: string; // Reference to admin user's email
};

interface AnnouncementContextType {
  mosqueDetails: MosqueDetails[];
  filteredMosqueDetails: MosqueDetails[];
  subscribe: (id: number) => void;
  searchMosque: (searchText: string, type?: "mosque" | "activity") => void;
  // admin functions
  addMosque: (
    mosqueName: string,
    description: string,
    picture: string
  ) => Promise<void>;
  getMosqueByAdminId: (adminEmail: string) => MosqueDetails | undefined;
  updateMosquePicture: (mosqueId: number, picture: string) => Promise<void>;
  updateMosque: (
    mosqueId: number,
    updates: Partial<MosqueDetails>
  ) => Promise<MosqueDetails | undefined>;
  addAnnouncement: (
    mosqueId: number,
    announcement: Omit<Announcement, "id" | "createdAt">
  ) => Promise<void>;
  deleteAnnouncement: (
    mosqueId: number,
    announcementId: number
  ) => Promise<void>;
  addActivity: (
    mosqueId: number,
    activity: Omit<Activity, "id" | "createdAt">
  ) => Promise<void>;
  deleteActivity: (mosqueId: number, activityId: number) => Promise<void>;
  // Get subscribed mosques for a user
  getSubscribedMosques: (userEmail: string) => MosqueDetails[];
  loadMosqueDetails: () => Promise<void>;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(
  undefined
);

export const AnnouncementProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mosqueDetails, setMosqueDetails] = useState<MosqueDetails[]>([
    // {
    //   id: 1,
    //   mosque: "Masjid Sultan Salahuddin Abdul Aziz Shah",
    //   picture: require("../../assets/images/masjid_sultan_salahuddin.png"),
    //   description:
    //     "Masjid Sultan Salahuddin Abdul Aziz Shah, also known as the Blue Mosque, is the state mosque of Selangor, located in Shah Alam, Malaysia. It is one of the largest mosques in Southeast Asia, featuring a stunning blue dome and intricate Islamic architecture. The mosque hosts daily prayers, community events, and educational programs.",
    //   mosqueLat: 3.078159,
    //   mosqueLong: 101.518303,
    //   announcement: [
    //     {
    //       title: "Prayer Timings Update",
    //       date: new Date("2025-01-16T08:00:00Z"),
    //       description:
    //         "The prayer timings for the month of January have been updated.",
    //     },
    //     {
    //       title: "Weekly Quran Recitation",
    //       date: new Date("2025-01-19T19:00:00Z"),
    //       description:
    //         "Join us for weekly Quran recitation sessions every Thursday night.",
    //     },
    //   ],
    //   activity: [
    //     {
    //       title: "Kuliah Maghrib",
    //       date: new Date("2025-01-16T08:00:00Z"),
    //       startTime: "07:30 PM",
    //       endTime: "08:30 PM",
    //     },
    //   ],
    //   isSubscribe: true,
    // },
    // {
    //   id: 2,
    //   mosque: "Masjid Al-Ikhlas, Seksyen 13",
    //   picture: require("../../assets/images/masjid_al_ikhlas.jpg"),
    //   description:
    //     "Masjid Al-Ikhlas is a prominent mosque located in Seksyen 13, Shah Alam. Known for its vibrant community programs, the mosque serves as a center for Islamic education and social activities for the surrounding neighborhoods.",
    //   mosqueLat: 3.079234,
    //   mosqueLong: 101.529012,
    //   announcement: [
    //     {
    //       title: "Community Event",
    //       date: new Date("2025-01-17T10:00:00Z"),
    //       description: "Join us for a community gathering this weekend.",
    //     },
    //     {
    //       title: "Charity Fundraiser",
    //       date: new Date("2025-01-18T14:00:00Z"),
    //       description:
    //         "We are hosting a fundraiser for underprivileged families in the area.",
    //     },
    //   ],
    //   activity: [],
    //   isSubscribe: false,
    // },
    // {
    //   id: 3,
    //   mosque: "Masjid Al-Wathiqu Billah",
    //   picture: require("../../assets/images/masjid_al_watique.jpg"),
    //   description:
    //     "Masjid Al-Wathiqu Billah Tuanku Mizan Zainal Abidin, commonly known as Masjid UiTM, is the central mosque of Universiti Teknologi MARA (UiTM) in Shah Alam, Selangor, Malaysia.",
    //   mosqueLat: 3.073764,
    //   mosqueLong: 101.519791,
    //   announcement: [
    //     {
    //       title: "Weekly Sermon",
    //       date: new Date("2025-01-19T11:00:00Z"),
    //       description:
    //         "This week’s sermon will focus on strengthening family ties.",
    //     },
    //   ],
    //   activity: [],
    //   isSubscribe: true,
    // },
    // {
    //   id: 4,
    //   mosque: "Masjid Al-Falah, Seksyen 7",
    //   picture: require("../../assets/images/masjid_al_falah.jpg"),
    //   description:
    //     "Masjid Al-Falah is located in Seksyen 7, Shah Alam, serving the local community with daily prayers, religious talks, and educational programs. The mosque also organizes youth-focused events and charitable activities.",
    //   mosqueLat: 3.058527,
    //   mosqueLong: 101.503607,
    //   announcement: [
    //     {
    //       title: "Ramadan Preparation",
    //       date: new Date("2025-02-01T15:00:00Z"),
    //       description:
    //         "We are organizing a series of events in preparation for Ramadan.",
    //     },
    //   ],
    //   activity: [
    //     {
    //       title: "Kuliah Maghrib",
    //       date: new Date("2025-02-01T15:00:00Z"),
    //       startTime: "07:30 PM",
    //       endTime: "08:00 PM",
    //     },
    //   ],
    //   isSubscribe: false,
    // },
  ]);
  const [filteredMosqueDetails, setFilteredMosqueDetails] = useState<
    MosqueDetails[]
  >([]);
  const { sendNotificationToSubscribers } = useNotifications();
  const { user, updateUser } = useAuth(); // Get current user

  useEffect(() => {
    // Load mosque details from AsyncStorage on mount
    loadMosqueDetails();
  }, []);

  const addAnnouncement = async (
    mosqueId: number,
    announcement: Omit<Announcement, "id" | "createdAt">
  ) => {
    const updatedMosques = mosqueDetails.map((mosque) => {
      if (mosque.id === mosqueId && mosque.adminId === user?.email) {
        const newAnnouncement = {
          ...announcement,
          id: Date.now(),
          createdAt: new Date(),
        };
        return {
          ...mosque,
          announcement: [...mosque.announcement, newAnnouncement],
        };
      }
      return mosque;
    });

    await saveMosqueDetails(updatedMosques);
    
    // Send notification to subscribers
    const mosque = mosqueDetails.find(m => m.id === mosqueId);
    if (mosque) {
      await sendNotificationToSubscribers(
        mosqueId,
        announcement.title,
        `New announcement from ${mosque.mosque}: ${announcement.description}`
      );
    }
  };

  const loadMosqueDetails = async () => {
    try {
      const storedMosques = await AsyncStorage.getItem("mosques");

      if (storedMosques) {
        const parsedMosques = JSON.parse(storedMosques);

        const mosquesWithoutImages = parsedMosques.map(
          (mosque: MosqueDetails) => {
            const { picture, ...mosqueWithoutImage } = mosque;
            return mosqueWithoutImage;
          }
        );

        setMosqueDetails(parsedMosques);
        setFilteredMosqueDetails(parsedMosques);
      }
    } catch (error) {
      console.error("Error loading mosque details:", error);
    }
  };

  // const loadMosqueDetails = async () => {
  //   try {
  //     const storedMosques = await AsyncStorage.getItem('mosques');
  //     if (storedMosques) {
  //       const parsedMosques = JSON.parse(storedMosques);
  //       setMosqueDetails(parsedMosques);
  //       setFilteredMosqueDetails(parsedMosques);
  //     }
  //   } catch (error) {
  //     console.error('Error loading mosque details:', error);
  //   }
  // };

  const addMosque = async (
    mosqueName: string,
    description: string,
    picture: string
  ) => {
    if (!user?.email || user.role !== "admin") return;

    // Check if admin already manages a mosque
    const existingMosque = mosqueDetails.find(
      (mosque) => mosque.adminId === user.email
    );
    if (existingMosque) {
      throw new Error("Admin already manages a mosque");
    }

    const newMosque: MosqueDetails = {
      id: Date.now(),
      mosque: mosqueName,
      description: description,
      picture: picture,
      mosqueLat: 0,
      mosqueLong: 0,
      announcement: [],
      activities: [],
      isSubscribe: false,
      adminId: user.email,
    };

    const updatedMosques = [...mosqueDetails, newMosque];
    await saveMosqueDetails(updatedMosques);

    // Update user's managedMosqueId in AuthContext
    await updateUser({ managedMosqueId: newMosque.id });
  };

  const getMosqueByAdminId = (
    adminEmail: string
  ): MosqueDetails | undefined => {
    return mosqueDetails.find((mosque) => mosque.adminId === adminEmail);
  };

  const updateMosquePicture = async (mosqueId: number, picture: string) => {
    if (!user?.email || user.role !== "admin") return;

    const updatedMosques = mosqueDetails.map((mosque) => {
      if (mosque.id === mosqueId && mosque.adminId === user.email) {
        return { ...mosque, picture };
      }
      return mosque;
    });

    await saveMosqueDetails(updatedMosques);
  };

  const updateMosque = async (
    mosqueId: number,
    updates: Partial<MosqueDetails>
  ) => {
    if (!user?.email || user.role !== "admin") return;

    try {
      // Create new array with updates
      const updatedMosques = mosqueDetails.map((mosque) => {
        if (mosque.id === mosqueId && mosque.adminId === user.email) {
          return { ...mosque, ...updates };
        }
        return mosque;
      });

      // Save to AsyncStorage first
      await AsyncStorage.setItem("mosques", JSON.stringify(updatedMosques));

      // Then update state
      setMosqueDetails(updatedMosques);
      setFilteredMosqueDetails(updatedMosques);

      // Return the updated mosque for the Profile component
      return updatedMosques.find((mosque) => mosque.id === mosqueId);
    } catch (error) {
      console.error("Error updating mosque:", error);
      throw error;
    }
  };

  const saveMosqueDetails = async (updatedMosques: MosqueDetails[]) => {
    try {
      await AsyncStorage.setItem("mosques", JSON.stringify(updatedMosques));

      setMosqueDetails(updatedMosques);
      setFilteredMosqueDetails(updatedMosques);
    } catch (error) {
      console.error("Error saving mosque details:", error);
      throw error;
    }
  };

  const deleteAnnouncement = async (
    mosqueId: number,
    announcementId: number
  ) => {
    const updatedMosques = mosqueDetails.map((mosque) => {
      if (mosque.id === mosqueId && mosque.adminId === user?.email) {
        return {
          ...mosque,
          announcement: mosque.announcement.filter(
            (a) => a.id !== announcementId
          ),
        };
      }
      return mosque;
    });

    await saveMosqueDetails(updatedMosques);
  };

  const addActivity = async (
    mosqueId: number,
    activity: Omit<Activity, "id" | "createdAt">
  ) => {
    if (!user?.email) return;

    const updatedMosques = mosqueDetails.map((mosque) => {
      if (mosque.id === mosqueId && mosque.adminId === user.email) {
        const newActivity = {
          ...activity,
          id: Date.now(),
          createdAt: new Date(),
        };
        return {
          ...mosque,
          activities: [...mosque.activities, newActivity],
        };
      }
      return mosque;
    });

    await saveMosqueDetails(updatedMosques);
  };

  const deleteActivity = async (mosqueId: number, activityId: number) => {
    if (!user?.email) return;

    const updatedMosques = mosqueDetails.map((mosque) => {
      if (mosque.id === mosqueId && mosque.adminId === user.email) {
        return {
          ...mosque,
          activities: mosque.activities.filter((a) => a.id !== activityId),
        };
      }
      return mosque;
    });

    await saveMosqueDetails(updatedMosques);
  };

  const getSubscribedMosques = (userEmail: string): MosqueDetails[] => {
    return mosqueDetails.filter((mosque) => mosque.isSubscribe);
  };

  const subscribe = async (id: number) => {
    // Find the mosque first
    const mosque = mosqueDetails.find((m) => m.id === id);
    if (!mosque) return;

    const updatedMosques = mosqueDetails.map((mosque) =>
      mosque.id === id
        ? { ...mosque, isSubscribe: !mosque.isSubscribe }
        : mosque
    );
    await saveMosqueDetails(updatedMosques);

    // Save subscription to user's subscriptions
    if (user?.email) {
      try {
        const subscriptionsJson = await AsyncStorage.getItem(
          `subscriptions_${user.email}`
        );
        let subscriptions = subscriptionsJson
          ? JSON.parse(subscriptionsJson)
          : [];

        if (mosque.isSubscribe) {
          // If already subscribed, remove from subscriptions
          subscriptions = subscriptions.filter((subId: number) => subId !== id);
        } else {
          // If not subscribed, add to subscriptions
          subscriptions.push(id);
        }

        await AsyncStorage.setItem(
          `subscriptions_${user.email}`,
          JSON.stringify(subscriptions)
        );
      } catch (error) {
        console.error("Error saving subscription:", error);
      }
    }
  };

  const searchMosque = (
    mosqueName: string,
    type: "mosque" | "activity" = "mosque"
  ) => {
    if (mosqueName.trim() === "") {
      setFilteredMosqueDetails(mosqueDetails);
    } else {
      const searchText = mosqueName.toLowerCase();
      setFilteredMosqueDetails(
        mosqueDetails.filter((mosque) => {
          if (type === "mosque") {
            return mosque.mosque.toLowerCase().includes(searchText);
          } else {
            return mosque.activities?.some((activity) =>
              activity.activityName.toLowerCase().includes(searchText)
            );
          }
        })
      );
    }
  };

  // const subscribeToMosque = (id: number) => {
  //   setMosqueDetails((prevDetails) =>
  //     prevDetails.map((mosque) =>
  //       mosque.id === id
  //         ? { ...mosque, isSubscribe: !mosque.isSubscribe }
  //         : mosque
  //     )
  //   );
  //   setFilteredMosqueDetails((prevDetails) =>
  //     prevDetails.map((mosque) =>
  //       mosque.id === id
  //         ? { ...mosque, isSubscribe: !mosque.isSubscribe }
  //         : mosque
  //     )
  //   );
  // };

  // const searchMosque = (mosqueName: string) => {
  //   if (mosqueName.trim() === "") {
  //     // Reset to original mosque details if search is empty
  //     setFilteredMosqueDetails(mosqueDetails);
  //   } else {
  //     // Filter mosques based on the search keyword
  //     setFilteredMosqueDetails(
  //       mosqueDetails.filter((mosque) =>
  //         mosque.mosque.toLowerCase().includes(mosqueName.toLowerCase())
  //       )
  //     );
  //   }
  // };

  return (
    <AnnouncementContext.Provider
      value={{
        mosqueDetails,
        filteredMosqueDetails,
        subscribe,
        searchMosque,
        addAnnouncement,
        deleteAnnouncement,
        addActivity,
        deleteActivity,
        getSubscribedMosques,
        addMosque,
        getMosqueByAdminId,
        updateMosquePicture,
        updateMosque,
        loadMosqueDetails,
      }}
    >
      {children}
    </AnnouncementContext.Provider>
  );
};

export const useAnnouncements = (): AnnouncementContextType => {
  const context = useContext(AnnouncementContext);

  if (!context) {
    throw new Error(
      "useAnnouncements must be used within an AnnouncementContextType"
    );
  }
  return context;
};
