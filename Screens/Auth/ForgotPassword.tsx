// src/screens/Auth/ForgotPassword.tsx
import React, { useState } from 'react';
import { View, Image, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../Context/AuthContext';

// Define navigation param list
export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  LocationAvailability: undefined;
  Appointment: undefined;
  Settings: undefined;
};

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ForgotPassword'
>;

type Props = {
  navigation: ForgotPasswordScreenNavigationProp;
};

const logo = require('../../assets/crescent-small-green.png')

export default function ForgotPassword({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const { forgotPassword, isLoading } = useAuth();

  const handleForgotPassword = async () => {
    try {
      await forgotPassword(email);
      // You might want to show a success message and/or navigate back to SignIn
      Alert.alert(
        "Password Reset",
        "If an account exists for this email, you will receive password reset instructions.",
        [
          { text: "OK", onPress: () => navigation.navigate('SignIn') }
        ]
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.topNav}>
        <Image source={logo} style={{ width: 240, resizeMode: 'contain' }} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.description}>
          Enter your email address and we'll send you instructions to reset your password.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TouchableOpacity 
          style={styles.button}
          onPress={handleForgotPassword}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Sending...' : 'Send Reset Instructions'}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomContainer}>
          <View style={styles.optionContainer}>
            <Text style={styles.optionText}>Remember your password?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.optionTextLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
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
    alignItems: 'center',
    justifyContent: "center",
    height: 60,
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 100,
  },
  contentContainer: {
    flex: 1,
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#39B440',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  bottomContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
    paddingBottom: 24,
  },
  optionContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  optionText: {
    fontSize: 16,
  },
  optionTextLink: {
    color: '#39B440',
    fontSize: 16,
  },
});