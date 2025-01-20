import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import PrayerTimes from "../Home/PrayerTime";
import { LinearGradient } from "expo-linear-gradient";
import PrayerTimesDisplay from "../Home/AllPrayerTime";
import { useAuth } from "../Context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigations/AppNavigation"; // Reusing your navigation types

const Home = () => {
  const width = Dimensions.get("window").width;
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#006400", "#66C266"]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0.3 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Profile Avatar Button */}
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

        <ImageBackground source={require("../../assets/mosque_background.jpg")}>
          <PrayerTimes />
        </ImageBackground>
        <PrayerTimesDisplay />
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
  adminText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default Home;