import { createContext, ReactNode, useContext, useState } from "react";
import MosqueDetails from "../Model/AnnouncementData";

interface AnnouncementContextType {
  mosqueDetails: MosqueDetails[];
  filteredMosqueDetails: MosqueDetails[];
  subscribe: (id: number) => void;
  searchMosque: (mosqueName: string) => void;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(
  undefined
);

export const AnnouncementProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mosqueDetails, setMosqueDetails] = useState<MosqueDetails[]>([
    {
      id: 1,
      mosque: "Masjid Sultan Salahuddin Abdul Aziz Shah",
      picture: require("../../assets/images/masjid_sultan_salahuddin.png"),
      description:
        "Masjid Sultan Salahuddin Abdul Aziz Shah, also known as the Blue Mosque, is the state mosque of Selangor, located in Shah Alam, Malaysia. It is one of the largest mosques in Southeast Asia, featuring a stunning blue dome and intricate Islamic architecture. The mosque hosts daily prayers, community events, and educational programs.",
      mosqueLat: 3.078159,
      mosqueLong: 101.518303,
      announcement: [
        {
          title: "Prayer Timings Update",
          date: new Date("2025-01-16T08:00:00Z"),
          description:
            "The prayer timings for the month of January have been updated.",
        },
        {
          title: "Weekly Quran Recitation",
          date: new Date("2025-01-19T19:00:00Z"),
          description:
            "Join us for weekly Quran recitation sessions every Thursday night.",
        },
      ],
      activity: [
        {
          title: "Kuliah Maghrib",
          date: new Date("2025-01-16T08:00:00Z"),
          startTime: "07:30 PM",
          endTime: "08:30 PM",
        },
      ],
      isSubscribe: true,
    },
    {
      id: 2,
      mosque: "Masjid Al-Ikhlas, Seksyen 13",
      picture: require("../../assets/images/masjid_al_ikhlas.jpg"),
      description:
        "Masjid Al-Ikhlas is a prominent mosque located in Seksyen 13, Shah Alam. Known for its vibrant community programs, the mosque serves as a center for Islamic education and social activities for the surrounding neighborhoods.",
      mosqueLat: 3.079234,
      mosqueLong: 101.529012,
      announcement: [
        {
          title: "Community Event",
          date: new Date("2025-01-17T10:00:00Z"),
          description: "Join us for a community gathering this weekend.",
        },
        {
          title: "Charity Fundraiser",
          date: new Date("2025-01-18T14:00:00Z"),
          description:
            "We are hosting a fundraiser for underprivileged families in the area.",
        },
      ],
      activity: [],
      isSubscribe: false,
    },
    {
      id: 3,
      mosque: "Masjid Al-Wathiqu Billah",
      picture: require("../../assets/images/masjid_al_watique.jpg"),
      description:
        "Masjid Al-Wathiqu Billah Tuanku Mizan Zainal Abidin, commonly known as Masjid UiTM, is the central mosque of Universiti Teknologi MARA (UiTM) in Shah Alam, Selangor, Malaysia.",
      mosqueLat: 3.073764,
      mosqueLong: 101.519791,
      announcement: [
        {
          title: "Weekly Sermon",
          date: new Date("2025-01-19T11:00:00Z"),
          description:
            "This week’s sermon will focus on strengthening family ties.",
        },
      ],
      activity: [],
      isSubscribe: true,
    },
    {
      id: 4,
      mosque: "Masjid Al-Falah, Seksyen 7",
      picture: require("../../assets/images/masjid_al_falah.jpg"),
      description:
        "Masjid Al-Falah is located in Seksyen 7, Shah Alam, serving the local community with daily prayers, religious talks, and educational programs. The mosque also organizes youth-focused events and charitable activities.",
      mosqueLat: 3.058527,
      mosqueLong: 101.503607,
      announcement: [
        {
          title: "Ramadan Preparation",
          date: new Date("2025-02-01T15:00:00Z"),
          description:
            "We are organizing a series of events in preparation for Ramadan.",
        },
      ],
      activity: [
        {
          title: "Kuliah Maghrib",
          date: new Date("2025-02-01T15:00:00Z"),
          startTime: "07:30 PM",
          endTime: "08:00 PM",
        },
      ],
      isSubscribe: false,
    },
  ]);

  const subscribeToMosque = (id: number) => {
    setMosqueDetails((prevDetails) =>
      prevDetails.map((mosque) =>
        mosque.id === id
          ? { ...mosque, isSubscribe: !mosque.isSubscribe }
          : mosque
      )
    );
    setFilteredMosqueDetails((prevDetails) =>
      prevDetails.map((mosque) =>
        mosque.id === id
          ? { ...mosque, isSubscribe: !mosque.isSubscribe }
          : mosque
      )
    );
  };

  const [filteredMosqueDetails, setFilteredMosqueDetails] =
    useState<MosqueDetails[]>(mosqueDetails);

  const searchMosque = (mosqueName: string) => {
    if (mosqueName.trim() === "") {
      // Reset to original mosque details if search is empty
      setFilteredMosqueDetails(mosqueDetails);
    } else {
      // Filter mosques based on the search keyword
      setFilteredMosqueDetails(
        mosqueDetails.filter((mosque) =>
          mosque.mosque.toLowerCase().includes(mosqueName.toLowerCase())
        )
      );
    }
  };

  return (
    <AnnouncementContext.Provider
      value={{
        mosqueDetails,
        filteredMosqueDetails,
        subscribe: subscribeToMosque,
        searchMosque,
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
