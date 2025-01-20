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
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../Context/AuthContext";
import { useAnnouncements, MosqueDetails, Activity } from "../Context/AnnouncementContext";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigations/AppNavigation";

const ActivityAdmin = () => {
  const { user } = useAuth();
  const { addActivity, deleteActivity, mosqueDetails } = useAnnouncements();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [modalVisible, setModalVisible] = useState(false);
  const [activityName, setActivityName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [managedMosque, setManagedMosque] = useState<MosqueDetails | null>(null);

  useEffect(() => {
    const mosque = mosqueDetails.find(m => m.adminId === user?.email);
    console.log("Found mosque:", mosque);
    if (mosque) {
      setManagedMosque(mosque);
    }
  }, [mosqueDetails, user]);

  const handleAddActivity = async () => {
    if (!activityName.trim() || !startTime.trim() || !endTime.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (managedMosque) {
      try {
        const newActivity = {
          activityName,
          startTime,
          endTime,
          date: new Date(),
          mosqueName: managedMosque.mosque
        };

        await addActivity(managedMosque.id, newActivity);
        
        setModalVisible(false);
        setActivityName("");
        setStartTime("");
        setEndTime("");
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
          }
        }
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
            onPress={() => navigation.navigate('Profile')}
          >
            {user?.image ? (
              <Image 
                source={{ uri: user.image }} 
                style={styles.profileImage} 
              />
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
                  <Text style={styles.activityTitle}>{activity.activityName}</Text>
                  <TouchableOpacity onPress={() => handleDeleteActivity(activity.id)}>
                    <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
                <View style={styles.activityDetails}>
                  <View style={styles.timeContainer}>
                    <Ionicons name="time-outline" size={20} color="#666" />
                    <Text style={styles.timeText}>
                      {activity.startTime} - {activity.endTime}
                    </Text>
                  </View>
                  <Text style={styles.activityDate}>
                    {new Date(activity.date).toLocaleDateString()}
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
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>New Activity</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Activity Name"
                value={activityName}
                onChangeText={setActivityName}
                placeholderTextColor="#666"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Start Time (e.g., 9:00 AM)"
                value={startTime}
                onChangeText={setStartTime}
                placeholderTextColor="#666"
              />
              
              <TextInput
                style={styles.input}
                placeholder="End Time (e.g., 10:00 AM)"
                value={endTime}
                onChangeText={setEndTime}
                placeholderTextColor="#666"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, { backgroundColor: '#FF3B30' }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, { backgroundColor: '#39B440' }]}
                  onPress={handleAddActivity}
                >
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  profileButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  mosqueInfoContainer: {
    padding: 20,
    alignItems: 'center',
  },
  mosqueName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  mosqueSubtitle: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.8,
  },
  mainContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  activityCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  activityDetails: {
    marginTop: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  activityDate: {
    fontSize: 14,
    color: '#999',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#39B440',
    width: 40,
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ActivityAdmin;