import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { RouteProp, useRoute } from "@react-navigation/native";
import MosqueDetails from "../../Model/AnnouncementData";
import { format } from "date-fns";

type MosqueDetailParams = {
  mosqueSelected: MosqueDetails;
};

type RootStackParamList = {
  MosqueDetail: MosqueDetailParams;
};

const MosqueDetail = () => {
  const route = useRoute<RouteProp<RootStackParamList, "MosqueDetail">>();
  const { mosqueSelected } = route.params;
  const {
    mosqueLat: latitude,
    mosqueLong: longitude,
    picture,
    description,
    mosque,
    announcement,
    activities,
    isSubscribe,
  } = mosqueSelected;

  const mapRef = useRef<MapView>(null);
  const [activeTab, setActiveTab] = useState<'activities' | 'announcements'>('activities');

  useEffect(() => {
    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  }, [latitude, longitude]);

  const openInMaps = () => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${latitude},${longitude}`;
    const label = mosque;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={typeof picture === 'string' ? { uri: picture } : picture} 
          style={styles.mosqueImage} 
          resizeMode="cover" 
        />
        <View style={styles.mosqueNameContainer}>
          <Text style={styles.mosqueName}>{mosque}</Text>
        </View>
      </View>

      {/* Map Card */}
      <View style={styles.mapCard}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={{ latitude, longitude }} title={mosque} />
        </MapView>
        
        <TouchableOpacity style={styles.directionsButton} onPress={openInMaps}>
          <Text style={styles.directionsButtonText}>Get Directions</Text>
        </TouchableOpacity>
      </View>

      {/* Description Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About the Mosque</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'activities' && styles.activeTab]}
          onPress={() => setActiveTab('activities')}
        >
          <Text style={[styles.tabText, activeTab === 'activities' && styles.activeTabText]}>
            Activities
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'announcements' && styles.activeTab]}
          onPress={() => setActiveTab('announcements')}
        >
          <Text style={[styles.tabText, activeTab === 'announcements' && styles.activeTabText]}>
            Announcements
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'activities' ? (
        <View style={styles.section}>
          {activities && activities.length > 0 ? (
            activities.map((activity, index) => (
              <View key={index} style={styles.activityCard}>
                <Text style={styles.activityTitle}>{activity.activityName}</Text>
                <Text style={styles.activityTime}>
                  {format(new Date(activity.date), 'MMMM dd, yyyy')}
                </Text>
                <Text style={styles.activitySchedule}>
                  {activity.startTime} - {activity.endTime}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyMessage}>No activities scheduled</Text>
          )}
        </View>
      ) : (
        <View style={styles.section}>
          {announcement && announcement.length > 0 ? (
            announcement.map((item, index) => (
              <View key={index} style={styles.announcementCard}>
                <Text style={styles.announcementTitle}>{item.title}</Text>
                <Text style={styles.announcementDate}>
                  {format(new Date(item.date), 'MMMM dd, yyyy')}
                </Text>
                <Text style={styles.announcementDescription}>
                  {item.description}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyMessage}>No announcements available</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  mosqueImage: {
    width: '100%',
    height: '100%',
  },
  mosqueNameContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
  },
  mosqueName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  mapCard: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  map: {
    height: 200,
  },
  directionsButton: {
    backgroundColor: '#009688',
    padding: 12,
    alignItems: 'center',
  },
  directionsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#009688',
  },
  tabText: {
    color: '#666',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: 'white',
  },
  activityCard: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  activitySchedule: {
    fontSize: 14,
    color: '#009688',
  },
  announcementCard: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  announcementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  announcementDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  announcementDescription: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default MosqueDetail;