import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    Dimensions,
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
  import { useAnnouncements, MosqueDetails, Announcement } from "../Context/AnnouncementContext";
  import { useNotifications } from "../Context/NotificationContext";
  import { useNavigation } from "@react-navigation/native";
  import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
  import type { RootStackParamList } from "../../navigations/AppNavigation";
  
  const AnnouncementAdmin = () => {
    const width = Dimensions.get("window").width;
    const { user } = useAuth();
    const { addAnnouncement, deleteAnnouncement, mosqueDetails } = useAnnouncements();
    const { addNotification } = useNotifications();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [managedMosque, setManagedMosque] = useState<any>(null);
  
    useEffect(() => {
      // Find the mosque managed by this admin
      const mosque = mosqueDetails.find(m => m.adminId === user?.email);
      if (mosque) {
        setManagedMosque(mosque);
      }
    }, [mosqueDetails, user]);
  
    const handleAddAnnouncement = async () => {
      if (!title.trim() || !description.trim()) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }
    
      if (managedMosque) {
        try {
          const newAnnouncement = {
            title,
            description,
            date: new Date(), // Current date
            mosqueName: managedMosque.mosque
          };
    
          await addAnnouncement(managedMosque.id, newAnnouncement);
          
          setModalVisible(false);
          setTitle("");
          setDescription("");
          Alert.alert("Success", "Announcement added successfully");
        } catch (error) {
          console.error("Error adding announcement:", error);
          Alert.alert("Error", "Failed to add announcement");
        }
      } else {
        Alert.alert("Error", "No mosque found to manage");
      }
    };
  
    const handleDeleteAnnouncement = async (announcementId: number) => {
      if (!managedMosque) {
        Alert.alert("Error", "No mosque found to manage");
        return;
      }
    
      Alert.alert(
        "Delete Announcement",
        "Are you sure you want to delete this announcement?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteAnnouncement(managedMosque.id, announcementId);
                Alert.alert("Success", "Announcement deleted successfully");
              } catch (error) {
                console.error("Error deleting announcement:", error);
                Alert.alert("Error", "Failed to delete announcement");
              }
            }
          }
        ]
      );
    };
  
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={["#006400", "#66C266"]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0.3 }}
          end={{ x: 0, y: 1 }}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Mosque Announcements</Text>
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
  
          {/* Announcements List */}
          <ScrollView style={styles.contentContainer} contentContainerStyle={styles.scrollViewContent}>
            {managedMosque?.announcement.map((announcement: Announcement, index: number) => (
              <View key={announcement.id} style={styles.announcementCard}>
                <View style={styles.announcementHeader}>
                  <Text style={styles.announcementTitle}>{announcement.title}</Text>
                  <TouchableOpacity onPress={() => handleDeleteAnnouncement(announcement.id)}>
                    <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.announcementDescription}>{announcement.description}</Text>
                <Text style={styles.announcementDate}>
                  {new Date(announcement.date).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </ScrollView>
  
          {/* Add Announcement Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>New Announcement</Text>
                
                <TextInput
                  style={styles.input}
                  placeholder="Announcement Title"
                  value={title}
                  onChangeText={setTitle}
                  placeholderTextColor="#666"
                />
                
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Announcement Description"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
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
                    onPress={handleAddAnnouncement}
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
    defaultAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#ffffff',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#006400',
    },
    avatarText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#006400',
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
    contentContainer: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: 20,
      minHeight: '70%',
    },
    scrollViewContent: {
      padding: 20,
      paddingBottom: 100, // Add extra padding at bottom for the floating button
    },
    announcementCard: {
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
    announcementHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    announcementTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      flex: 1,
    },
    announcementDescription: {
      fontSize: 16,
      color: '#666',
      marginBottom: 10,
    },
    announcementDate: {
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
    textArea: {
      height: 100,
      textAlignVertical: 'top',
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
  
  export default AnnouncementAdmin;