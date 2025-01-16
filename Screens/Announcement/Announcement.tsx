import React from "react";
import { AnnouncementProvider } from "../Context/AnnouncementContext";
import Section from "./Section";

const Announcement = () => {
  return (
    <AnnouncementProvider>
      <Section />
    </AnnouncementProvider>
  );
};

export default Announcement;
