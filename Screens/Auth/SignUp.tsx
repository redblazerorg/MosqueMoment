import React, { useState, useEffect } from 'react';
import { View, Image, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../Context/AuthContext';
import type { UserRole } from '../Context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

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

// Define navigation prop type
type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SignUp'
>;

type Props = {
  navigation: SignUpScreenNavigationProp;
};

const logo = require('../../assets/crescent-small-green.png')

export default function SignUp({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const { signup, isLoading } = useAuth();

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const usersJson = await AsyncStorage.getItem('users');
        const users = usersJson ? JSON.parse(usersJson) : [];
        console.log('All users in storage:', users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    getAllUsers();
  }, []);

  const handleSignup = async () => {
    try {
      await signup(email, name, password, role); 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

      <View style={styles.topNav}>
          <Image source={logo} style={{ width: 240, resizeMode: 'contain' }} />
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
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.roleContainer}>
        <TouchableOpacity 
          style={[styles.roleButton, role === 'user' && styles.roleButtonActive]}
          onPress={() => setRole('user')}
        >
          <Text style={[styles.roleButtonText, role === 'user' && styles.roleButtonTextActive]}>
            User
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.roleButton, role === 'admin' && styles.roleButtonActive]}
          onPress={() => setRole('admin')}
        >
          <Text style={[styles.roleButtonText, role === 'admin' && styles.roleButtonTextActive]}>
            Admin
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={handleSignup}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Loading...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <View style={styles.optionContainer}>
          <Text style={styles.optionText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.optionTextLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

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
    marginTop: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  link: {
    color: '#000',
    textAlign: 'right',
    marginBottom: 30,
  },
  bottomContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  buttonMain: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    backgroundColor: '#2ED573',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextMain: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
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
  error: {
    color: 'red',
    textAlign: 'center',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#39B440',
    marginHorizontal: 5,
  },
  roleButtonActive: {
    backgroundColor: '#39B440',
  },
  roleButtonText: {
    textAlign: 'center',
    color: '#39B440',
  },
  roleButtonTextActive: {
    color: 'white',
  },
});