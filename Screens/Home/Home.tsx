import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import React from "react";
import PrayerTimes from "./PrayerTime";
import { LinearGradient } from "expo-linear-gradient";
import PrayerTimesDisplay from "./AllPrayerTime";

const Home = () => {
  const width = Dimensions.get("window").width;
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#006400", "#66C266"]} // Dark green to light green
        style={styles.gradient}
        start={{ x: 0, y: 0.3 }}
        end={{ x: 0, y: 1 }} // This makes the gradient transition happen in top 30%
      >
        <ImageBackground source={require("../../assets/mosque_background.jpg")}>
          <PrayerTimes />
        </ImageBackground>
        <View
          style={{
            width: width * 1,
          }}
        >
          <View
            style={{
              borderRadius: 12,
              height: 300,
              backgroundColor: "whitesmoke",
              margin: 10,
            }}
          >
            <PrayerTimesDisplay />
          </View>
        </View>
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
});

export default Home;
