// Authentication Context - Global auth state management with full Firebase integration

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirebaseAuth } from '../services/firebase';
import { User, AuthState, UserRole } from '../types';
import {
  loginWithEmail,
  loginWithPhone,
  registerWithEmail,
  signOutUser,
  resetPassword,
  sendPhoneOTP,
  verifyPhoneOTP,
  createUserWithRole,
  updateUserProfile,
  getUserData,
  setUserOnlineStatus,
  getAuthErrorMessage,
} from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Extend FirebaseUser type
interface ExtendedUser extends FirebaseUser {
  role?: UserRole;
  displayName?: string;
  phoneNumber?: string;
}

interface AuthContextType extends AuthState {
  // Login methods
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string, password: string) => Promise<void>;
  // Registration
  registerWithEmail: (
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
    phoneNumber?: string,
    farmName?: string,
    farmLocation?: string
  ) => Promise<void>;
  // Phone OTP
  sendPhoneOTP: (phone: string) => Promise<any>;
  verifyPhoneOTP: (confirmationResult: any, otp: string) => Promise<void>;
  // Password reset
  resetPassword: (email: string) => Promise<void>;
  // Session
  logout: () => Promise<void>;
  // Profile
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  // Role helpers
  isFarmer: boolean;
  isBuyer: boolean;
  isSupplier: boolean;
  isAdmin: boolean;
  // Simple accessors
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  role: UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  // Cache for Firebase user
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  // Derive role helpers from user
  const isFarmer = state.user?.role === 'farmer';
  const isBuyer = state.user?.role === 'buyer';
  const isSupplier = state.user?.role === 'supplier';
  const isAdmin = state.user?.role === 'admin';

  // Simple accessors
  const displayName = state.user?.displayName || null;
  const email = state.user?.email || null;
  const phoneNumber = state.user?.phoneNumber || null;
  const role = state.user?.role || null;

  // Initialize auth state from AsyncStorage
  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const auth = getFirebaseAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      
      if (fbUser) {
        try {
          const userData = await getUserData(fbUser.uid);
          if (userData) {
            setState({
              isAuthenticated: true,
              user: userData,
              loading: false,
              error: null,
            });
            // Set online status
            await setUserOnlineStatus(fbUser.uid, true);
          } else {
            // User exists in Firebase Auth but not in Firestore
            setState({
              isAuthenticated: true,
              user: {
                id: fbUser.uid,
                email: fbUser.email || '',
                phoneNumber: fbUser.phoneNumber || '',
                displayName: fbUser.displayName || '',
                role: 'farmer', // Default role
                createdAt: new Date(),
                updatedAt: new Date(),
                followersCount: 0,
                followingCount: 0,
              },
              loading: false,
              error: null,
            });
          }
        } catch (error: any) {
          setState({
            isAuthenticated: true,
            user: {
              id: fbUser.uid,
              email: fbUser.email || '',
              phoneNumber: fbUser.phoneNumber || '',
              displayName: fbUser.displayName || '',
              role: 'farmer',
              createdAt: new Date(),
              updatedAt: new Date(),
              followersCount: 0,
              followingCount: 0,
            },
            loading: false,
            error: null,
          });
        }
      } else {
        setState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => {
      unsubscribe();
      // Set offline on unmount
      if (firebaseUser) {
        setUserOnlineStatus(firebaseUser.uid, false).catch(() => {});
      }
    };
  }, []);

  // Load stored auth from AsyncStorage
  const loadStoredAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('auth_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setState({
          isAuthenticated: true,
          user: userData,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    }
  };

  // Save user to AsyncStorage
  const saveAuth = async (user: User | null) => {
    try {
      if (user) {
        await AsyncStorage.setItem('auth_user', JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem('auth_user');
      }
    } catch (error) {
      console.error('Error saving auth:', error);
    }
  };

  // ============ LOGIN METHODS ============

  const handleLoginWithEmail = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const user = await loginWithEmail({ email, password });
      
      setState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null,
      });
      
      await saveAuth(user);
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: getAuthErrorMessage(error.code) || error.message,
      }));
      throw error;
    }
  }, []);

  const handleLoginWithPhone = useCallback(async (phone: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const user = await loginWithPhone(phone, password);
      
      setState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null,
      });
      
      await saveAuth(user);
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: getAuthErrorMessage(error.code) || error.message,
      }));
      throw error;
    }
  }, []);

  // ============ REGISTRATION ============

  const handleRegister = useCallback(async (
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
    phoneNumber?: string,
    farmName?: string,
    farmLocation?: string
  ) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const registerData = {
        email,
        password,
        displayName,
        role,
        phoneNumber: phoneNumber || '',
        farmName,
        farmLocation,
      };
      
      const user = await registerWithEmail(registerData);
      
      setState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null,
      });
      
      await saveAuth(user);
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: getAuthErrorMessage(error.code) || error.message,
      }));
      throw error;
    }
  }, []);

  // ============ PHONE OTP ============

  const handleSendPhoneOTP = useCallback(async (phone: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await sendPhoneOTP(phone);
      
      setState(prev => ({ ...prev, loading: false, error: null }));
      return result;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: getAuthErrorMessage(error.code) || error.message,
      }));
      throw error;
    }
  }, []);

  const handleVerifyPhoneOTP = useCallback(async (confirmationResult: any, otp: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const user = await verifyPhoneOTP(confirmationResult, otp);
      
      setState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null,
      });
      
      await saveAuth(user);
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: getAuthErrorMessage(error.code) || error.message,
      }));
      throw error;
    }
  }, []);

  // ============ PASSWORD RESET ============

  const handleResetPassword = useCallback(async (email: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      await resetPassword(email);
      
      setState(prev => ({ ...prev, loading: false, error: null }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: getAuthErrorMessage(error.code) || error.message,
      }));
      throw error;
    }
  }, []);

  // ============ LOGOUT ============

  const handleLogout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Set offline first
      if (state.user?.id) {
        await setUserOnlineStatus(state.user.id, false);
      }
      
      await signOutUser();
      
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
      
      await saveAuth(null);
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      throw error;
    }
  }, [state.user?.id]);

  // ============ PROFILE UPDATE ============

  const handleUpdateProfile = useCallback(async (data: Partial<User>) => {
    if (!state.user?.id) {
      throw new Error('User not authenticated');
    }
    
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      await updateUserProfile(state.user.id, data);
      
      const updatedUser = { ...state.user, ...data };
      
      setState(prev => ({
        ...prev,
        user: updatedUser,
        loading: false,
        error: null,
      }));
      
      await saveAuth(updatedUser);
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      throw error;
    }
  }, [state.user]);

  // ============ REFRESH USER ============

  const handleRefreshUser = useCallback(async () => {
    if (!state.user?.id) return;
    
    try {
      const userData = await getUserData(state.user.id);
      if (userData) {
        setState(prev => ({
          ...prev,
          user: userData,
        }));
        await saveAuth(userData);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  }, [state.user?.id]);

  // ============ LEGACY METHODS (for backward compatibility) ============

  const login = handleLoginWithEmail;
  const register = handleRegister;

  return (
    <AuthContext.Provider
      value={{
        ...state,
        // Login
        loginWithEmail: handleLoginWithEmail,
        loginWithPhone: handleLoginWithPhone,
        // Registration
        registerWithEmail: handleRegister,
        // Phone OTP
        sendPhoneOTP: handleSendPhoneOTP,
        verifyPhoneOTP: handleVerifyPhoneOTP,
        // Password reset
        resetPassword: handleResetPassword,
        // Session
        logout: handleLogout,
        // Profile
        updateProfile: handleUpdateProfile,
        refreshUser: handleRefreshUser,
        // Legacy
        login,
        register,
        // Role helpers
        isFarmer,
        isBuyer,
        isSupplier,
        isAdmin,
        // Simple accessors
        displayName,
        email,
        phoneNumber,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};