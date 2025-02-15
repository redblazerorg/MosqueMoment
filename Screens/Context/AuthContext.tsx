// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserRole = "admin" | "user";

export type User = {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  image?: string;
  mobileNo?: string;
  address?: string;
  managedMosqueId?: number; //for admin role
  userLat?: number;
  userLong?: number;
};

type EditableUserFields = {
  name: string;
  image: string;
  mobileNo: string;
  address: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  //   setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    email: string,
    name: string,
    password: string,
    role?: UserRole
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateUser: (updatedData: Partial<User>) => Promise<boolean>;
  updateUserLocation: (
    userLat: number,
    userLong: number,
    userData: User | null
  ) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Here typically validate credentials at backend

      // For demo purposes, just store the user data
      const usersJson = await AsyncStorage.getItem("users");
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        await AsyncStorage.setItem("user", JSON.stringify(foundUser));
        setUser(foundUser);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    name: string,
    password: string,
    role: UserRole = "user"
  ) => {
    try {
      setIsLoading(true);

      const usersJson = await AsyncStorage.getItem("users");
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      // Check if user already exists
      if (users.some((u) => u.email === email)) {
        return false;
      }

      const newUser: User = { email, name, password, role };
      users.push(newUser);

      await AsyncStorage.setItem("users", JSON.stringify(users));
      await AsyncStorage.setItem("user", JSON.stringify(newUser));

      setUser(newUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const usersJson = await AsyncStorage.getItem("users");
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      // Check if user exists
      const userExists = users.some((u) => u.email === email);

      if (!userExists) {
        throw new Error("No account found with this email");
      }

      // This would typically involve sending a reset email
      // For demo purposes, we'll just console log
      console.log("Password reset requested for:", email);
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updatedData: Partial<User>) => {
    try {
      setIsLoading(true);
      const usersJson = await AsyncStorage.getItem("users");
      let users: User[] = usersJson ? JSON.parse(usersJson) : [];

      // Find and update user in users array
      users = users.map((u) => {
        if (u.email === user?.email) {
          return { ...u, ...updatedData };
        }
        return u;
      });

      // Update users in AsyncStorage
      await AsyncStorage.setItem("users", JSON.stringify(users));

      // Update current user
      const updatedUser = { ...user, ...updatedData } as User;
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error("Update user error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserLocation = async (
    userLat: number,
    userLong: number,
    userData: User | null
  ) => {
    try {
      if (!userData) return;

      const updatedUser = {
        ...userData,
        userLat,
        userLong,
      };

      setUser(updatedUser);
    } catch (error) {
      console.error("Update location error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        signup,
        logout,
        forgotPassword,
        updateUser,
        isLoading,
        updateUserLocation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
