// Main Navigator - Temo Thuo Market

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

import { MainTabParamList, AuthStackParamList } from './types';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';

// Import screens
import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

import DashboardScreen from '../screens/dashboard/DashboardScreen';
import CropManagementScreen from '../screens/crops/CropManagementScreen';
import AddCropScreen from '../screens/crops/AddCropScreen';
import CropDetailScreen from '../screens/crops/CropDetailScreen';
import LivestockManagementScreen from '../screens/livestock/LivestockManagementScreen';
import AddLivestockScreen from '../screens/livestock/AddLivestockScreen';

import MarketplaceScreen from '../screens/marketplace/MarketplaceScreen';
import ProductDetailScreen from '../screens/marketplace/ProductDetailScreen';
import AddProductScreen from '../screens/marketplace/AddProductScreen';
import CartScreen from '../screens/marketplace/CartScreen';
import CheckoutScreen from '../screens/marketplace/CheckoutScreen';

import SocialFeedScreen from '../screens/social/SocialFeedScreen';
import PostDetailScreen from '../screens/social/PostDetailScreen';
import CreatePostScreen from '../screens/social/CreatePostScreen';

import ConversationsListScreen from '../screens/messaging/ConversationsListScreen';
import ChatScreen from '../screens/messaging/ChatScreen';

import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';

import WeatherScreen from '../screens/weather/WeatherScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import WalletScreen from '../screens/payments/WalletScreen';
import SettingsScreen from '../screens/dashboard/SettingsScreen';

// Create navigators
const Tab = createBottomTabNavigator<MainTabParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();

// Auth Stack Navigator
export const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Splash" component={SplashScreen} />
      <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
};

// Tab Bar Icon Component
const TabBarIcon: React.FC<{ name: string; focused: boolean }> = ({ name, focused }) => {
  const getIconName = (): string => {
    switch (name) {
      case 'Home':
        return focused ? 'home' : 'home-outline';
      case 'Marketplace':
        return focused ? 'storefront' : 'storefront-outline';
      case 'Social':
        return focused ? 'people' : 'people-outline';
      case 'Messages':
        return focused ? 'chatbubbles' : 'chatbubbles-outline';
      case 'Profile':
        return focused ? 'person' : 'person-outline';
      default:
        return 'help-outline';
    }
  };

  return (
    <View style={styles.tabIconContainer}>
      <Ionicons
        name={getIconName() as any}
        size={24}
        color={focused ? COLORS.primary : COLORS.textSecondary}
      />
    </View>
  );
};

// Main Tab Navigator
export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabBarIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackNavigator}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Marketplace" 
        component={MarketplaceStackNavigator}
        options={{ tabBarLabel: 'Market' }}
      />
      <Tab.Screen 
        name="Social" 
        component={SocialStackNavigator}
        options={{ tabBarLabel: 'Community' }}
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesStackNavigator}
        options={{ tabBarLabel: 'Messages' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStackNavigator}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Home Stack Navigator
const HomeStack = createStackNavigator();

const HomeStackNavigator: React.FC = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen name="Dashboard" component={DashboardScreen} />
      <HomeStack.Screen name="CropManagement" component={CropManagementScreen} />
      <HomeStack.Screen name="AddCrop" component={AddCropScreen} />
      <HomeStack.Screen name="CropDetail" component={CropDetailScreen} />
      <HomeStack.Screen name="LivestockManagement" component={LivestockManagementScreen} />
      <HomeStack.Screen name="AddLivestock" component={AddLivestockScreen} />
      <HomeStack.Screen name="Weather" component={WeatherScreen} />
      <HomeStack.Screen name="Notifications" component={NotificationsScreen} />
      <HomeStack.Screen name="Wallet" component={WalletScreen} />
      <HomeStack.Screen name="Settings" component={SettingsScreen} />
    </HomeStack.Navigator>
  );
};

// Marketplace Stack Navigator
const MarketplaceStack = createStackNavigator();

const MarketplaceStackNavigator: React.FC = () => {
  return (
    <MarketplaceStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MarketplaceStack.Screen name="MarketplaceHome" component={MarketplaceScreen} />
      <MarketplaceStack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <MarketplaceStack.Screen name="AddProduct" component={AddProductScreen} />
      <MarketplaceStack.Screen name="Cart" component={CartScreen} />
      <MarketplaceStack.Screen name="Checkout" component={CheckoutScreen} />
    </MarketplaceStack.Navigator>
  );
};

// Social Stack Navigator
const SocialStack = createStackNavigator();

const SocialStackNavigator: React.FC = () => {
  return (
    <SocialStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <SocialStack.Screen name="SocialFeed" component={SocialFeedScreen} />
      <SocialStack.Screen name="PostDetail" component={PostDetailScreen} />
      <SocialStack.Screen name="CreatePost" component={CreatePostScreen} />
    </SocialStack.Navigator>
  );
};

// Messages Stack Navigator
const MessagesStack = createStackNavigator();

const MessagesStackNavigator: React.FC = () => {
  return (
    <MessagesStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MessagesStack.Screen name="ConversationsList" component={ConversationsListScreen} />
      <MessagesStack.Screen name="Chat" component={ChatScreen} />
    </MessagesStack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStack = createStackNavigator();

const ProfileStackNavigator: React.FC = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ProfileStack.Screen name="ViewProfile" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
    </ProfileStack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
    height: 60,
  },
  tabBarLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
    marginTop: 2,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});