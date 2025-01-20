import React, { useState } from "react";
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../Context/AuthContext";

// Define navigation param list
export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  Profile: undefined;
  LocationAvailability: undefined;
  Appointment: undefined;
  Settings: undefined;
  SelectedService: { service: string };
};

// Define navigation prop type
type SignInScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SignIn"
>;

type Props = {
  navigation: SignInScreenNavigationProp;
};

const logo = require('../../assets/crescent-small-green.png')

export default function SignIn({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.topNav}>
        <Image source={logo} style={{ width: 100, resizeMode: "contain" }} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Loading..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <View style={styles.optionContainer}>
          <Text style={styles.optionText}>Don't have account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.optionTextLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  topNav: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 100,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#39B440",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  link: {
    color: "#000",
    textAlign: "right",
    marginBottom: 30,
  },
  bottomContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 8,
  },
  buttonMain: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    backgroundColor: "#2ED573",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTextMain: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  optionContainer: {
    flexDirection: "row",
    gap: 4,
  },
  optionText: {
    fontSize: 16,
  },
  optionTextLink: {
    color: "#39B440",
    fontSize: 16,
  },
  error: {
    color: "red",
    textAlign: "center",
  },
});
