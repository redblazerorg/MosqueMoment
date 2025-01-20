import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useAnnouncements, MosqueDetails } from "../../Context/AnnouncementContext";
import { useNavigation } from "@react-navigation/native";
import { AnnouncementStackParamList } from "../../../navigations/AppNavigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<AnnouncementStackParamList>;

const MosqueAvailable = () => {
  const { subscribe, filteredMosqueDetails, searchMosque, mosqueDetails } = useAnnouncements();
  const width = Dimensions.get("window").width;
  const navigation = useNavigation<NavigationProp>();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchType, setSearchType] = useState<'mosque' | 'activity'>('mosque');

  const handleSearch = (text: string) => {
    setSearchKeyword(text);
    const keyword = text.toLowerCase();

    if (searchType === 'mosque') {
      // Use the existing searchMosque function for mosque names
      searchMosque(text);
    } else {
      // Custom search for activities
      searchMosque(text, 'activity');
    }
  };

  const convertMosqueForNavigation = (mosque: MosqueDetails) => {
    return {
      ...mosque,
      activity: mosque.activities || [], // Convert activities to activity
    };
  };

  return (
    <View style={styles.container}>
      {/* Search Section */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder={`Search by ${searchType === 'mosque' ? 'mosque name' : 'activity'}...`}
          value={searchKeyword}
          onChangeText={handleSearch}
        />
        
        {/* Search Type Toggle */}
        <View style={styles.searchTypeContainer}>
          <TouchableOpacity 
            style={[
              styles.searchTypeButton, 
              searchType === 'mosque' && styles.activeSearchType
            ]}
            onPress={() => {
              setSearchType('mosque');
              handleSearch(searchKeyword);
            }}
          >
            <Text style={[
              styles.searchTypeText,
              searchType === 'mosque' && styles.activeSearchTypeText
            ]}>
              Mosque
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.searchTypeButton, 
              searchType === 'activity' && styles.activeSearchType
            ]}
            onPress={() => {
              setSearchType('activity');
              handleSearch(searchKeyword);
            }}
          >
            <Text style={[
              styles.searchTypeText,
              searchType === 'activity' && styles.activeSearchTypeText
            ]}>
              Activity
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredMosqueDetails.map((mosque) => (
          <View key={mosque.id} style={styles.mosqueCard}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("MosqueDetail", {
                  mosqueSelected: convertMosqueForNavigation(mosque),
                });
              }}
            >
              <View style={styles.mosqueContent}>
                <View style={styles.mosqueInfo}>
                  <Text style={styles.mosqueName}>{mosque.mosque}</Text>
                  <Text numberOfLines={6} style={styles.mosqueDescription}>
                    {mosque.description}
                  </Text>
                  
                  {/* Show activities if searching by activity */}
                  {searchType === 'activity' && mosque.activities?.some(activity => 
                    activity.activityName.toLowerCase().includes(searchKeyword.toLowerCase())
                  ) && (
                    <View style={styles.activitiesContainer}>
                      <Text style={styles.activitiesTitle}>Matching Activities:</Text>
                      {mosque.activities
                        .filter(activity => 
                          activity.activityName.toLowerCase().includes(searchKeyword.toLowerCase())
                        )
                        .map((activity, idx) => (
                          <Text key={idx} style={styles.activityItem}>
                            • {activity.activityName}
                          </Text>
                        ))
                      }
                    </View>
                  )}
                </View>
                
                {mosque.picture && (
                  <Image
                    source={{ uri: mosque.picture }}
                    style={styles.mosqueImage}
                  />
                )}
              </View>

              <TouchableOpacity 
                style={styles.subscribeButton}
                onPress={() => subscribe(mosque.id)}
              >
                <Text style={styles.subscribeButtonText}>
                  {mosque.isSubscribe ? "Unsubscribe" : "Subscribe"}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  searchSection: {
    marginTop: 50,
    marginBottom: 20,
  },
  searchInput: {
    height: 50,
    borderColor: "#ccc",
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchTypeContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  searchTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeSearchType: {
    backgroundColor: '#66C266',
  },
  searchTypeText: {
    color: '#666',
  },
  activeSearchTypeText: {
    color: 'white',
  },
  mosqueCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mosqueContent: {
    flexDirection: "row",
  },
  mosqueInfo: {
    flex: 1,
    marginRight: 10,
  },
  mosqueName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  mosqueDescription: {
    color: '#666',
  },
  mosqueImage: {
    width: Dimensions.get("window").width * 0.4,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  activitiesContainer: {
    marginTop: 10,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
  },
  activitiesTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  activityItem: {
    color: '#666',
    marginLeft: 5,
  },
  subscribeButton: {
    backgroundColor: "#66C266",
    borderRadius: 12,
    width: 90,
    padding: 2,
    marginTop: 10,
  },
  subscribeButtonText: {
    textAlign: "center",
    color: "white",
  },
});

export default MosqueAvailable;