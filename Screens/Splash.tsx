import React, { useEffect } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Importing useNavigation hook
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../Screens/Context/AuthContext";

const Splash = ({ navigation }: { navigation: any }) => {
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Check user role and navigate accordingly
      if (user?.role === 'admin') {
        navigation.replace("AdminMain");
      } else {
        navigation.replace("Main");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={["#006400", "#66C266"]} // Dark green to light green
      style={styles.gradient}
      start={{ x: 0, y: 0.3 }}
      end={{ x: 0, y: 1 }} // This makes the gradient transition happen in top 30%
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: 130, height: 130, tintColor: "white" }}
          source={require("../assets/crescent.png")}
        />
        <Text style={{ fontSize: 20, color: "white", marginTop: 20 }}>
          MosqueMoments
        </Text>

        {/* Loading indicator */}
        <ActivityIndicator
          size="large"
          color="white"
          style={{ marginTop: 20 }}
        />
      </View>
    </LinearGradient>
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
export default Splash;
