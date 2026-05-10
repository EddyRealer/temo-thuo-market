// User Types
export type UserRole = 'farmer' | 'buyer' | 'supplier' | 'admin';

export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  farmName?: string;
  farmLocation?: string;
  farmType?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  followersCount: number;
  followingCount: number;
  isOnline?: boolean;
}

// Authentication Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email?: string;
  phoneNumber?: string;
  password: string;
}

export interface RegisterData {
  email: string;
  phoneNumber: string;
  password: string;
  displayName: string;
  role: UserRole;
  farmName?: string;
  farmLocation?: string;
}

// Crop Types
export type CropType = 'maize' | 'sorghum' | 'beans' | 'tomatoes' | 'vegetables' | 'sunflower' | 'watermelon';

export interface Crop {
  id: string;
  userId: string;
  type: CropType;
  name: string;
  plantingDate: Date;
  expectedHarvestDate: Date;
  actualHarvestDate?: Date;
  quantity: number;
  unit: string;
  status: 'planted' | 'growing' | 'ready' | 'harvested';
  irrigationSchedule?: string;
  fertilizerReminders?: string[];
  diseaseReports?: DiseaseReport[];
  photos?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiseaseReport {
  id: string;
  date: Date;
  description: string;
  severity: 'low' | 'medium' | 'high';
  photoURL?: string;
  treated: boolean;
}

// Livestock Types
export type LivestockType = 'cattle' | 'goats' | 'sheep' | 'chickens' | 'pigs';

export interface Livestock {
  id: string;
  userId: string;
  type: LivestockType;
  name: string;
  tagNumber?: string;
  breed?: string;
  dateOfBirth?: Date;
  weight: number;
  weightUnit: string;
  status: 'active' | 'sold' | 'deceased';
  vaccinationRecords: VaccinationRecord[];
  breedingRecords: BreedingRecord[];
  diseaseReports: DiseaseReport[];
  photos?: string[];
  purchasePrice?: number;
  salePrice?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VaccinationRecord {
  id: string;
  date: Date;
  vaccine: string;
  nextDueDate?: Date;
  veterinarian?: string;
  cost?: number;
}

export interface BreedingRecord {
  id: string;
  date: Date;
  partnerId?: string;
  result?: string;
  offspringCount?: number;
  notes?: string;
}

// Marketplace Types
export type ProductCategory = 'crops' | 'livestock' | 'vegetables' | 'dairy' | 'equipment' | 'seeds' | 'fertilizer';

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerPhoto?: string;
  title: string;
  description: string;
  category: ProductCategory;
  price: number;
  currency: string;
  quantity: number;
  unit: string;
  photos: string[];
  condition?: string;
  location: string;
  deliveryOptions: string[];
  rating?: number;
  reviewCount?: number;
  status: 'available' | 'pending' | 'sold';
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  deliveryOption: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

// Social Media Types
export interface Post {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  content: string;
  photos?: string[];
  videoURL?: string;
  likes: string[];
  commentsCount: number;
  sharesCount: number;
  isTrending: boolean;
  createdAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  content: string;
  likes: string[];
  replies: Comment[];
  createdAt: Date;
}

// Messaging Types
export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  lastMessageTime: Date;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'voice';
  imageURL?: string;
  voiceURL?: string;
  readBy: string[];
  createdAt: Date;
}

// Weather Types
export interface Weather {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
  forecast: ForecastDay[];
  alerts: WeatherAlert[];
}

export interface ForecastDay {
  date: Date;
  high: number;
  low: number;
  condition: string;
  icon: string;
  precipitation: number;
}

export interface WeatherAlert {
  id: string;
  type: 'rain' | 'drought' | 'frost' | 'storm';
  severity: 'low' | 'medium' | 'high';
  message: string;
  startTime: Date;
  endTime?: Date;
}

// Payment Types
export interface Wallet {
  userId: string;
  balance: number;
  currency: string;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'payment' | 'received';
  amount: number;
  currency: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'marketplace' | 'comment' | 'message' | 'weather' | 'livestock' | 'system';
  title: string;
  body: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}

// Language Types
export type Language = 'en' | 'tn';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Payment Types
export type PaymentProvider = 'orange_money' | 'visa' | 'mastercard' | 'wallet';

export interface PaymentMethod {
  id?: string;
  type: 'mobile_money' | 'card' | 'wallet';
  provider: PaymentProvider;
  phoneNumber?: string;
  last4?: string;
  cardType?: 'visa' | 'mastercard';
  isDefault?: boolean;
  status?: string;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  paymentMethod: PaymentMethod;
  recipientId?: string;
  sellerId?: string;
  orderId?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
  error?: string;
}