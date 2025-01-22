import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Platform,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../Context/AuthContext";
import {
  useAnnouncements,
  MosqueDetails,
  Activity,
  MosqueActivity,
} from "../Context/AnnouncementContext";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigations/AppNavigation";
import DateTimePicker from "@react-native-community/datetimepicker";

const ActivityAdmin = () => {
  const { user } = useAuth();
  const { addActivity, deleteActivity, mosqueDetails } = useAnnouncements();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [modalVisible, setModalVisible] = useState(false);
  const [activityName, setActivityName] = useState("");
  const [managedMosque, setManagedMosque] = useState<MosqueDetails | null>(
    null
  );

  // Date and Time states
  const [activityDate, setActivityDate] = useState(new Date());
  const [activityEndDate, setActivityEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  // Visibility states for pickers
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartClock, setShowStartClock] = useState(false);
  const [showEndClock, setShowEndClock] = useState(false);

  const [activityType, setActivityType] = useState<MosqueActivity>(
    MosqueActivity.ForumPerdana
  );

  const [ActivityModalVisible, setActivityModalVisible] = useState(false);

  const activities = Object.values(MosqueActivity);

  const toggleModal = () => {
    setActivityModalVisible(!ActivityModalVisible);
  };

  const handleSelect = (activity: MosqueActivity) => {
    setActivityType(activity);
    toggleModal();
  };

  const [newActivityImage, setNewActivityImage] = useState<string>("");

  useEffect(() => {
    const mosque = mosqueDetails.find((m) => m.adminId === user?.email);
    console.log("Found mosque:", mosque);
    if (mosque) {
      setManagedMosque(mosque);
    }
  }, [mosqueDetails, user]);

  // Date picker handler
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setActivityDate(selectedDate);
      // If end date is before start date, update it
      if (activityEndDate < selectedDate) {
        setActivityEndDate(selectedDate);
      }
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      // Only allow end dates that are after or equal to start date
      if (selectedDate >= activityDate) {
        setActivityEndDate(selectedDate);
      } else {
        Alert.alert("Invalid Date", "End date cannot be before start date");
      }
    }
  };

  // Start time picker handler
  const handleStartTimeChange = (event: any, selectedTime?: Date) => {
    setShowStartClock(Platform.OS === "ios");
    if (selectedTime) {
      setStartTime(selectedTime);
    }
  };

  // End time picker handler
  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndClock(Platform.OS === "ios");
    if (selectedTime) {
      setEndTime(selectedTime);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setNewActivityImage(base64Image);
    }
  };

  const handleAddActivity = async () => {
    if (!activityName.trim()) {
      Alert.alert("Error", "Please fill in activity name");
      return;
    }

    if (activityEndDate < activityDate) {
      Alert.alert("Error", "End date cannot be before start date");
      return;
    }

    if (managedMosque) {
      try {
        const newActivity = {
          activityName,
          startTime: startTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          endTime: endTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: activityDate,
          endDate: activityEndDate,
          mosqueName: managedMosque.mosque,
          picture: newActivityImage,
          activityType: activityType,
        };

        await addActivity(managedMosque.id, newActivity);

        setModalVisible(false);
        setActivityName("");
        setStartTime(new Date());
        setEndTime(new Date());
        setActivityDate(new Date());
        setActivityEndDate(new Date());
        setNewActivityImage("");
        Alert.alert("Success", "Activity added successfully");
      } catch (error) {
        console.error("Error adding activity:", error);
        Alert.alert("Error", "Failed to add activity");
      }
    } else {
      Alert.alert("Error", "No mosque found to manage");
    }
  };

  const handleDeleteActivity = async (activityId: number) => {
    if (!managedMosque) {
      Alert.alert("Error", "No mosque found to manage");
      return;
    }

    Alert.alert(
      "Delete Activity",
      "Are you sure you want to delete this activity?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteActivity(managedMosque.id, activityId);
              Alert.alert("Success", "Activity deleted successfully");
            } catch (error) {
              console.error("Error deleting activity:", error);
              Alert.alert("Error", "Failed to delete activity");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#006400", "#66C266"]}
        style={styles.gradient}
        start={{ x: 0, y: 0.3 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mosque Activities</Text>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate("Profile")}
          >
            {user?.image ? (
              <Image source={{ uri: user.image }} style={styles.profileImage} />
            ) : (
              <Ionicons name="person-circle" size={40} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>

        {/* Mosque Info */}
        {managedMosque && (
          <View style={styles.mosqueInfoContainer}>
            <Text style={styles.mosqueName}>{managedMosque.mosque}</Text>
            <Text style={styles.mosqueSubtitle}>Mosque Administrator</Text>

            {/* Add Button */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={30} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Activities List */}
        <View style={styles.mainContainer}>
          <ScrollView
            style={styles.contentContainer}
            contentContainerStyle={styles.scrollContent}
          >
            {managedMosque?.activities?.map((activity: Activity) => (
              <View key={activity.id} style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityTitle}>
                    {activity.activityName}
                  </Text>

                  <TouchableOpacity
                    onPress={() => handleDeleteActivity(activity.id)}
                  >
                    <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
                <View style={styles.activityDetails}>
                  {activity.picture && (
                    <Image
                      source={{ uri: activity.picture }}
                      style={[
                        styles.activityImage,
                        {
                          marginBottom: 10,
                        },
                      ]}
                    />
                  )}
                  <View style={styles.timeContainer}>
                    <Ionicons name="time-outline" size={20} color="#666" />
                    <Text style={styles.timeText}>
                      {activity.startTime} - {activity.endTime}
                    </Text>
                  </View>
                  <Text style={styles.activityDate}>
                    {new Date(activity.date).toLocaleDateString()} -{" "}
                    {new Date(activity.endDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Add Activity Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <ScrollView>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>New Activity</Text>

                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={pickImage}
                >
                  <Text style={styles.imageButtonText}>
                    {newActivityImage
                      ? "Change Activity Image"
                      : "Pick Activity Image"}
                  </Text>
                </TouchableOpacity>
                {newActivityImage && (
                  <Image
                    source={{ uri: newActivityImage }}
                    style={styles.previewImage}
                  />
                )}

                <View style={{ height: 10 }}></View>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={toggleModal}
                >
                  <Text style={styles.dropdownButtonText}>{activityType}</Text>
                </TouchableOpacity>

                {/* Modal for Dropdown */}
                <Modal
                  visible={ActivityModalVisible}
                  transparent
                  animationType="slide"
                  onRequestClose={toggleModal}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <FlatList
                        data={activities}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.radioOption}
                            onPress={() => handleSelect(item)}
                          >
                            <View
                              style={[
                                styles.radioCircle,
                                item === activityType && styles.radioSelected,
                              ]}
                            />
                            <Text style={styles.radioText}>{item}</Text>
                          </TouchableOpacity>
                        )}
                      />
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={toggleModal}
                      >
                        <Text style={styles.closeButtonText}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
                <View style={{ height: 10 }}></View>

                <TextInput
                  style={styles.input}
                  placeholder="Activity Name"
                  value={activityName}
                  onChangeText={setActivityName}
                  placeholderTextColor="#666"
                />

                {/* Start Date Picker */}
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.input}
                >
                  <Text style={{ color: "#666" }}>
                    Start Date: {activityDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    testID="datePicker"
                    value={activityDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                  />
                )}

                {/* End Date Picker */}
                <TouchableOpacity
                  onPress={() => setShowEndDatePicker(true)}
                  style={styles.input}
                >
                  <Text style={{ color: "#666" }}>
                    End Date: {activityEndDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                {showEndDatePicker && (
                  <DateTimePicker
                    testID="endDatePicker"
                    value={activityEndDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleEndDateChange}
                    minimumDate={activityDate}
                  />
                )}

                {/* Start Time Picker */}
                <TouchableOpacity
                  onPress={() => setShowStartClock(true)}
                  style={styles.input}
                >
                  <Text style={{ color: "#666" }}>
                    Start Time:{" "}
                    {startTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </TouchableOpacity>
                {showStartClock && (
                  <DateTimePicker
                    testID="startTimePicker"
                    value={startTime}
                    mode="time"
                    is24Hour={false}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleStartTimeChange}
                  />
                )}

                {/* End Time Picker */}
                <TouchableOpacity
                  onPress={() => setShowEndClock(true)}
                  style={styles.input}
                >
                  <Text style={{ color: "#666" }}>
                    End Time:{" "}
                    {endTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </TouchableOpacity>
                {showEndClock && (
                  <DateTimePicker
                    testID="endTimePicker"
                    value={endTime}
                    mode="time"
                    is24Hour={false}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleEndTimeChange}
                  />
                )}

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: "#FF3B30" }]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: "#39B440" }]}
                    onPress={handleAddActivity}
                  >
                    <Text style={styles.buttonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </Modal>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    marginTop: 20,
    alignSelf: "center",
    padding: 10,
    backgroundColor: "#39B440",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#39B440",
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: "#39B440",
  },
  radioText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownButton: {
    padding: 15,
    backgroundColor: "#39B440",
    borderRadius: 8,
  },
  dropdownButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  profileButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
  },
  mosqueInfoContainer: {
    padding: 20,
    alignItems: "center",
  },
  mosqueName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  mosqueSubtitle: {
    fontSize: 16,
    color: "#FFF",
    opacity: 0.8,
  },
  mainContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  activityCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  activityDetails: {
    marginTop: 5,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  timeText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 5,
  },
  activityDate: {
    fontSize: 14,
    color: "#999",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#39B440",
    width: 40,
    height: 40,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
  },
  imageButton: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  imageButtonText: {
    color: "#333",
    fontSize: 16,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  activityImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 12,
  },
});

export default ActivityAdmin;
