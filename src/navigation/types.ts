// Navigation Configuration - Temo Thuo Market

import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  PhoneLogin: undefined;
  OTPVerification: { verificationId: string; phoneNumber: string };
};

// Main Tab Navigator
export type MainTabParamList = {
  Home: undefined;
  Marketplace: undefined;
  Social: undefined;
  Messages: undefined;
  Profile: undefined;
};

// Home Stack (Dashboard)
export type HomeStackParamList = {
  Dashboard: undefined;
  CropManagement: undefined;
  AddCrop: undefined;
  EditCrop: { cropId: string };
  CropDetail: { cropId: string };
  LivestockManagement: undefined;
  AddLivestock: undefined;
  EditLivestock: { livestockId: string };
  LivestockDetail: { livestockId: string };
  Weather: undefined;
  Notifications: undefined;
  Wallet: undefined;
  Settings: undefined;
};

// Marketplace Stack
export type MarketplaceStackParamList = {
  MarketplaceHome: undefined;
  ProductDetail: { productId: string };
  AddProduct: undefined;
  EditProduct: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  SellerProfile: { sellerId: string };
  CategoryProducts: { category: string };
  SearchProducts: undefined;
  Orders: undefined;
  OrderDetail: { orderId: string };
};

// Social Stack
export type SocialStackParamList = {
  SocialFeed: undefined;
  PostDetail: { postId: string };
  CreatePost: undefined;
  EditPost: { postId: string };
  Comments: { postId: string };
  UserProfile: { userId: string };
  Followers: { userId: string };
  Following: { userId: string };
  Groups: undefined;
  GroupDetail: { groupId: string };
  CreateGroup: undefined;
  Trending: undefined;
};

// Messages Stack
export type MessagesStackParamList = {
  ConversationsList: undefined;
  Chat: { conversationId: string; participantName: string };
  NewChat: undefined;
  CallScreen: { conversationId: string };
};

// Profile Stack
export type ProfileStackParamList = {
  ViewProfile: undefined;
  EditProfile: undefined;
  MyProducts: undefined;
  MyPosts: undefined;
  Transactions: undefined;
  SavedItems: undefined;
  FarmDetails: undefined;
  SecuritySettings: undefined;
};

// Admin Stack
export type AdminStackParamList = {
  AdminDashboard: undefined;
  UserManagement: undefined;
  UserDetail: { userId: string };
  MarketplaceModeration: undefined;
  ReportHandling: undefined;
  Analytics: undefined;
  PaymentMonitoring: undefined;
  SystemSettings: undefined;
};

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Admin: NavigatorScreenParams<AdminStackParamList>;
};

// Declare global types for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}