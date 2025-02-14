import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { ItemProfileEnum } from "../utils/enum";
import {
  useAnnouncements,
  MosqueDetails,
} from "../Context/AnnouncementContext";
import { useAuth, User } from "../Context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { GOOGLE_PLACES_API_KEY } from "../Keys/Keys";

const Profile = ({ navigation }: { navigation: any }) => {
  const width = Dimensions.get("window").width;
  const { user, logout, updateUser } = useAuth();
  const [openFloatingProfile, setOpenFloatingProfile] =
    useState<boolean>(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });
  const { addMosque, getMosqueByAdminId, updateMosque, mosqueDetails } =
    useAnnouncements();
  const [managedMosque, setManagedMosque] = useState<
    MosqueDetails | undefined
  >();
  const [isEditing, setIsEditing] = useState(false);
  const [editedMosqueName, setEditedMosqueName] = useState("");
  const [editedMosqueDescription, setEditedMosqueDescription] = useState("");
  const [newMosqueImage, setNewMosqueImage] = useState<string>("");

  const [mosqueLat, setMosqueLat] = useState<number>(0);
  const [mosqueLong, setMosqueLong] = useState<number>(0);

  useEffect(() => {
    const loadMosqueData = async () => {
      if (user?.email && user.role === "admin") {
        const mosque = getMosqueByAdminId(user.email);
        if (mosque) {
          setManagedMosque(mosque);
          setEditedMosqueName(mosque.mosque);
          setEditedMosqueDescription(mosque.description);
        }
      }
    };

    loadMosqueData();
  }, [mosqueDetails, user]);

  // Update editedUser when user data changes
  useEffect(() => {
    if (user) {
      setEditedUser((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (editedMosqueName.length > 2) {
      fetchMosqueLocation(editedMosqueName);
    }
  }, [editedMosqueName]);

  const fetchMosqueLocation = async (mosqueName: string) => {
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
      mosqueName
    )}&inputtype=textquery&fields=geometry&key=${GOOGLE_PLACES_API_KEY}`;

    try {
      const response = await axios.get(url);
      const candidates = response.data.candidates;

      if (candidates.length > 0) {
        console.log(candidates[0].geometry.location);

        const location = candidates[0].geometry.location;
        setMosqueLat(location.lat);
        setMosqueLong(location.lng);
      }
    } catch (error) {
      console.error("Error fetching mosque location:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadMosqueData = async () => {
        if (user?.email && user.role === "admin") {
          const mosque = getMosqueByAdminId(user.email);
          if (mosque) {
            setManagedMosque(mosque);
            setEditedMosqueName(mosque.mosque);
            setEditedMosqueDescription(mosque.description);
          }
        }
      };

      loadMosqueData();
    }, [user])
  );

  const handleProfileSetting = () => {
    setOpenFloatingProfile(!openFloatingProfile);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleUserSaveChanges = async () => {
    try {
      const updatedData: Partial<User> = {};

      // Only include changed fields
      if (editedUser.name !== user?.name) {
        updatedData.name = editedUser.name;
      }
      if (editedUser.email !== user?.email) {
        updatedData.email = editedUser.email;
      }
      if (editedUser.password) {
        updatedData.password = editedUser.password;
      }

      const success = await updateUser(updatedData);
      if (success) {
        console.log("User update successful");
        setIsEditing(false);
        Alert.alert("Success", "Profile updated successfully");
      } else {
        console.log("User update failed");
        Alert.alert("Error", "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
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
      setNewMosqueImage(base64Image);
    }
  };

  const handleStartEditing = () => {
    setIsEditing(true);
    setEditedMosqueName(managedMosque?.mosque || "");
    setEditedMosqueDescription(managedMosque?.description || "");
    setNewMosqueImage("");
  };

  const handleMosqueSaveChanges = async () => {
    if (!managedMosque) return;

    if (!editedMosqueName.trim() || !editedMosqueDescription.trim()) {
      Alert.alert("Error", "Please fill in all mosque details");
      return;
    }

    try {
      const updates: Partial<MosqueDetails> = {
        mosque: editedMosqueName,
        description: editedMosqueDescription,
      };

      if (newMosqueImage) {
        updates.picture = newMosqueImage;
      }

      // Get the updated mosque data directly from updateMosque
      const updatedMosque = await updateMosque(managedMosque.id, updates);

      // Immediately update the local state with the new data
      if (updatedMosque) {
        setManagedMosque(updatedMosque);
        setEditedMosqueName(updatedMosque.mosque);
        setEditedMosqueDescription(updatedMosque.description);
      }

      setIsEditing(false);
      Alert.alert("Success", "Mosque details updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update mosque details");
    }
  };

  const handleAddMosque = async () => {
    if (!editedMosqueName.trim() || !editedMosqueDescription.trim()) {
      Alert.alert("Error", "Please fill in all mosque details");
      return;
    }

    if (!newMosqueImage) {
      Alert.alert("Error", "Please select a mosque image");
      return;
    }

    try {
      console.log(mosqueLat);
      console.log(mosqueLong);

      await addMosque(
        editedMosqueName,
        editedMosqueDescription,
        newMosqueImage,
        mosqueLat,
        mosqueLong
      );
      Alert.alert("Success", "Mosque added successfully");

      // Refresh managed mosque data
      const updatedMosque = getMosqueByAdminId(user!.email);
      setManagedMosque(updatedMosque);
      setEditedMosqueName("");
      setEditedMosqueDescription("");
      setNewMosqueImage("");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to add mosque");
    }
  };

  const renderAdminSection = () => {
    if (user?.role !== "admin") return null;

    return (
      <View style={styles.adminSection}>
        <Text style={styles.sectionTitle}>Mosque Management</Text>

        {managedMosque ? (
          <View style={styles.managedMosqueContainer}>
            {isEditing ? (
              // Edit Mode
              <>
                <Text style={styles.label}>Edit Mosque Details</Text>
                <TextInput
                  style={styles.input}
                  value={editedMosqueName}
                  onChangeText={setEditedMosqueName}
                  placeholder="Mosque Name"
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editedMosqueDescription}
                  onChangeText={setEditedMosqueDescription}
                  placeholder="Mosque Description"
                  multiline
                  numberOfLines={4}
                />
                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={pickImage}
                >
                  <Text style={styles.imageButtonText}>
                    {newMosqueImage
                      ? "Change Mosque Image"
                      : "Update Mosque Image"}
                  </Text>
                </TouchableOpacity>
                {newMosqueImage ? (
                  <Image
                    source={{ uri: newMosqueImage }}
                    style={styles.previewImage}
                  />
                ) : managedMosque.picture ? (
                  <Image
                    source={{ uri: managedMosque.picture }}
                    style={styles.previewImage}
                  />
                ) : null}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => setIsEditing(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={handleMosqueSaveChanges}
                  >
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              // View Mode
              <>
                <Text style={styles.mosqueTitle}>Your Managed Mosque:</Text>
                <Text style={styles.mosqueName}>{managedMosque.mosque}</Text>
                <Text style={styles.mosqueDescription}>
                  {managedMosque.description}
                </Text>
                {managedMosque.picture && (
                  <Image
                    source={{ uri: managedMosque.picture }}
                    style={styles.mosqueImage}
                  />
                )}
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleStartEditing}
                >
                  <Text style={styles.editButtonText}>Edit Mosque Details</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ) : (
          // Add New Mosque Form
          <View style={styles.addMosqueContainer}>
            <Text style={styles.label}>Add New Mosque</Text>
            <TextInput
              style={[
                styles.input,
                {
                  marginBottom: 10,
                },
              ]}
              value={editedMosqueName}
              onChangeText={setEditedMosqueName}
              placeholder="Mosque Name"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editedMosqueDescription}
              onChangeText={setEditedMosqueDescription}
              placeholder="Mosque Description"
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Text style={styles.imageButtonText}>
                {newMosqueImage ? "Change Mosque Image" : "Select Mosque Image"}
              </Text>
            </TouchableOpacity>
            {newMosqueImage && (
              <Image
                source={{ uri: newMosqueImage }}
                style={styles.previewImage}
              />
            )}
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddMosque}
            >
              <Text style={styles.addButtonText}>Add Mosque</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView>
      <TouchableWithoutFeedback
        accessible={false}
        onPress={() => {
          if (openFloatingProfile) setOpenFloatingProfile(false);
        }}
      >
        <View style={styles.container}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person-circle" size={80} color="#39B440" />
            </View>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editedUser.name}
                  onChangeText={(text) =>
                    setEditedUser({ ...editedUser, name: text })
                  }
                  placeholder="Enter name"
                />
              ) : (
                <Text style={styles.value}>{user?.name}</Text>
              )}
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>Email</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editedUser.email}
                  onChangeText={(text) =>
                    setEditedUser({ ...editedUser, email: text })
                  }
                  placeholder="Enter email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Text style={styles.value}>{user?.email}</Text>
              )}
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>Password</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editedUser.password}
                  onChangeText={(text) =>
                    setEditedUser({ ...editedUser, password: text })
                  }
                  placeholder="Enter new password"
                  secureTextEntry
                />
              ) : (
                <Text style={styles.value}>••••••••</Text>
              )}
            </View>

            {isEditing && (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleUserSaveChanges}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.settingsButton}>
            <TouchableOpacity onPress={handleProfileSetting}>
              <Ionicons name="settings" size={30} color="#39B440" />
            </TouchableOpacity>
          </View>

          {openFloatingProfile && (
            <View style={styles.floatingCard}>
              <View style={styles.menuContainer}>
                {Object.values(ItemProfileEnum).map((e, index) => (
                  <View key={index}>
                    {(() => {
                      switch (e) {
                        case ItemProfileEnum.Edit:
                          return (
                            <TouchableOpacity
                              style={styles.menuItem}
                              onPress={() => {
                                setIsEditing(!isEditing);
                                setOpenFloatingProfile(false);
                              }}
                            >
                              <Ionicons
                                name="pencil-sharp"
                                size={24}
                                color="#39B440"
                              />
                              <Text style={styles.menuText}>Edit</Text>
                            </TouchableOpacity>
                          );
                        case ItemProfileEnum.Logout:
                          return (
                            <TouchableOpacity
                              style={styles.menuItem}
                              onPress={handleLogout}
                            >
                              <Ionicons
                                name="log-out"
                                size={24}
                                color="#39B440"
                              />
                              <Text style={styles.menuText}>Logout</Text>
                            </TouchableOpacity>
                          );
                        default:
                          return null;
                      }
                    })()}
                  </View>
                ))}
              </View>
            </View>
          )}
          {renderAdminSection()}
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
    paddingTop: 40,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  infoContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
  },
  infoItem: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#39B440",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  settingsButton: {
    position: "absolute",
    top: 40,
    right: 10,
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
  },
  floatingCard: {
    position: "absolute",
    top: 70,
    right: 20,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(52, 52, 52, 0.01)",
  },
  menuContainer: {
    display: "flex",
    justifyContent: "flex-end",
    width: Dimensions.get("window").width * 0.35,
    alignSelf: "flex-end",
    backgroundColor: "white",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    paddingVertical: 10,
    alignItems: "center",
  },
  menuText: {
    marginTop: 4,
    color: "#333",
  },
  adminSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  managedMosqueContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  mosqueTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  mosqueName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  mosqueDescription: {
    fontSize: 14,
    color: "#666",
  },
  mosqueImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 12,
  },
  addMosqueContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
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
  addButton: {
    backgroundColor: "#39B440",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#39B440",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Profile;
