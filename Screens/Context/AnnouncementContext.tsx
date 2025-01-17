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
      mosque: "Al-Nour Mosque",
      picture: require("../../assets/al_nour.jpg"),
      description:
        "The Al-Nour Mosque (Arabic: مسجد النور) is a mosque in Abbassia, Cairo, Egypt. It is among the landmarks of the neighborhood and the largest mosques in the city with several different halls for multi-purposes. It conducts social activities and sporting events as well. The mosque contains other facilities such as library. ",
      mosqueLat: 40.748817,
      mosqueLong: -73.985428,
      announcement: [
        {
          title: "Prayer Timings Update",
          date: new Date("2025-01-16T08:00:00Z"),
          description:
            "The prayer timings for the month of January have been updated.",
        },
      ],
      isSubscribe: true,
    },
    {
      id: 2,
      mosque: "Al-Huda Mosque",
      picture: require("../../assets/al_nour.jpg"),
      description:
        "The Al-Nour Mosque (Arabic: مسجد النور) is a mosque in Abbassia, Cairo, Egypt. It is among the landmarks of the neighborhood and the largest mosques in the city with several different halls for multi-purposes. It conducts social activities and sporting events as well. The mosque contains other facilities such as library. ",
      mosqueLat: 40.73061,
      mosqueLong: -73.935242,
      announcement: [
        {
          title: "Community Event",
          date: new Date("2025-01-17T10:00:00Z"),
          description: "Join us for a community gathering this weekend.",
        },
        {
          title: "Charity Fundraiser",
          date: new Date("2025-01-18T14:00:00Z"),
          description: "We are hosting a fundraiser for the local orphanage.",
        },
      ],
      isSubscribe: false,
    },
    {
      id: 3,
      mosque: "Al-Fajr Mosque",
      picture: require("../../assets/al_nour.jpg"),
      description:
        "The Al-Nour Mosque (Arabic: مسجد النور) is a mosque in Abbassia, Cairo, Egypt. It is among the landmarks of the neighborhood and the largest mosques in the city with several different halls for multi-purposes. It conducts social activities and sporting events as well. The mosque contains other facilities such as library. ",
      mosqueLat: 40.712776,
      mosqueLong: -74.005974,
      announcement: [
        {
          title: "Weekly Sermon",
          date: new Date("2025-01-19T11:00:00Z"),
          description:
            "This week’s sermon will focus on patience and perseverance.",
        },
      ],
      isSubscribe: true,
    },
    {
      id: 4,
      mosque: "Al-Ikhlas Mosque",
      picture: require("../../assets/al_nour.jpg"),
      description:
        "The Al-Nour Mosque (Arabic: مسجد النور) is a mosque in Abbassia, Cairo, Egypt. It is among the landmarks of the neighborhood and the largest mosques in the city with several different halls for multi-purposes. It conducts social activities and sporting events as well. The mosque contains other facilities such as library. ",
      mosqueLat: 40.758896,
      mosqueLong: -73.98513,
      announcement: [
        {
          title: "New Year's Eve Prayer",
          date: new Date("2025-01-31T23:00:00Z"),
          description:
            "Join us for a special prayer session to welcome the new year.",
        },
        {
          title: "Ramadan Preparation",
          date: new Date("2025-02-01T15:00:00Z"),
          description:
            "We are organizing a series of events in preparation for Ramadan.",
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
