import { createContext, ReactNode, useContext, useState } from "react";
import MosqueDetails from "../Data/AnnouncementData";

interface AnnouncementContextType {
  mosqueDetails: MosqueDetails[];
  subscribe: (id: number) => void;
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
  };

  return (
    <AnnouncementContext.Provider
      value={{ mosqueDetails, subscribe: subscribeToMosque }}
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
