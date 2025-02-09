import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { Activity } from "../../Context/AnnouncementContext";

interface Props {
  activities: Activity[];
}

const ActivityTable: React.FC<Props> = ({ activities }) => {
  return (
    <ScrollView style={styles.container}>
      {activities.map((item, index) => {
        const startDate = new Date(item.date);
        const endDate = item.endDate ? new Date(item.endDate) : null;
        const startDay = startDate.getDate();
        const startMonth = startDate.toLocaleString("default", {
          month: "short",
        });
        const endDay = endDate ? endDate.getDate() : null;
        const endMonth = endDate
          ? endDate.toLocaleString("default", { month: "short" })
          : null;

        return (
          <View key={index} style={styles.card}>
            <View style={styles.imageContainer}>
              {item.picture && (
                <Image
                  source={{ uri: item.picture }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
              )}
              <View style={styles.statusBadgeContainer}>
                <View style={styles.statusBadge}>
                  {endDate ? (
                    <>
                      <Text style={styles.dayText}>
                        {startDay}
                        {startDay !== endDay ? ` - ${endDay}` : ""}
                      </Text>
                      <Text
                        style={[styles.monthText, { alignSelf: "flex-end" }]}
                      >
                        {startMonth}{" "}
                        {startMonth !== endMonth && `- ${endMonth}`}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.dayText}>{startDay}</Text>
                      <Text style={styles.monthText}>{startMonth}</Text>
                    </>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.contentContainer}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.title}>{item.activityName}</Text>
                <View style={styles.tagContainer}>
                  <Text style={styles.tagText}>{item.activityType}</Text>
                </View>
              </View>

              <Text
                style={styles.timeText}
              >{`${item.startTime} - ${item.endTime}`}</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  statusBadgeContainer: {
    position: "absolute",
    top: 16,
    left: 16,
  },
  statusBadge: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  monthText: {
    fontSize: 14,
    color: "#666",
    textTransform: "uppercase",
    textAlign: "center",
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  timeText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  tagContainer: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  tagText: {
    fontSize: 12,
    color: "#374151",
  },
});

export default ActivityTable;
