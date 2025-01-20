import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Activity } from "../../Context/AnnouncementContext";
// import { Activity } from "../../Model/AnnouncementData";

interface Props {
  activities: Activity[]; // Define a prop type for the activities array
}

const ActivityTable: React.FC<Props> = ({ activities }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Title</Text>
        <Text style={styles.headerText}>Date</Text>
        <Text style={styles.headerText}>Start</Text>
        <Text style={styles.headerText}>End</Text>
      </View>
      {activities.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.cell}>{item.activityName}</Text>
          <Text style={styles.cell}>{item.date.toDateString()}</Text>
          <Text style={styles.cell}>{item.startTime}</Text>
          <Text style={styles.cell}>{item.endTime}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  headerText: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
  },
});

export default ActivityTable;
