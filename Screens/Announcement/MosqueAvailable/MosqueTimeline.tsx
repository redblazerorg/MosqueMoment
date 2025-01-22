import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Activity, MosqueDetails } from "../../Context/AnnouncementContext";

interface TimelineItemProps {
  activity: Activity;
  isLast: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ activity, isLast }) => {
  const date = new Date(activity.date);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });

  return (
    <View style={styles.timelineItem}>
      {/* Date Column */}
      <View style={styles.dateColumn}>
        <Text style={styles.dayText}>{day}</Text>
        <Text style={styles.monthText}>{month}</Text>
        {/* Timeline dot and line */}
        <View style={styles.timelineDot} />
        {!isLast && <View style={styles.timelineLine} />}
      </View>

      {/* Content Column */}
      <View style={styles.contentCard}>
        <View style={[styles.statusBadge, { backgroundColor: "#00BFA6" }]}>
          <Text style={styles.statusText}>Active</Text>
        </View>
        <Text style={styles.activityName}>{activity.activityName}</Text>
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>
            {activity.startTime} - {activity.endTime}
          </Text>
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>Activity</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

interface MosqueTimelineProps {
  mosqueDetails: MosqueDetails[];
}

const MosqueTimeline: React.FC<MosqueTimelineProps> = ({ mosqueDetails }) => {
  // Flatten all activities from all mosques into a single array
  const allActivities = mosqueDetails.flatMap((mosque) =>
    mosque.activities.map((activity) => ({
      ...activity,
      mosqueName: mosque.mosque,
    }))
  );

  // Sort activities by date
  const sortedActivities = allActivities.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <FlatList
      data={sortedActivities}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => (
        <TimelineItem
          activity={item}
          isLast={index === sortedActivities.length - 1}
        />
      )}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  dateColumn: {
    width: 50,
    alignItems: "center",
    marginRight: 16,
  },
  dayText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  monthText: {
    fontSize: 14,
    color: "#666",
    textTransform: "uppercase",
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#00BFA6",
    marginVertical: 8,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#E0E0E0",
    position: "absolute",
    top: 45,
    bottom: -16,
    left: "50%",
    marginLeft: -1,
  },
  contentCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  activityName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaText: {
    color: "#666",
    fontSize: 12,
  },
  tagContainer: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    color: "#666",
    fontSize: 12,
  },
});

export default MosqueTimeline;
