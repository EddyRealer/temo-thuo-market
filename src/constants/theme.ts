// Temo Thuo Market - Theme Colors
// Modern African Agriculture Aesthetic

export const COLORS = {
  // Primary Colors - Earthy Green Palette
  primary: '#2D5A27',       // Deep forest green
  primaryLight: '#4A7C4F',  // Lighter green
  primaryDark: '#1E3D1A',   // Darker green

  // Secondary Colors - Warm Earth Tones
  secondary: '#C4A35A',     // Gold/wheat color
  secondaryLight: '#D4B86A',
  secondaryDark: '#A38B42',

  // Accent Colors
  accent: '#E67E22',        // Burnt orange for highlights
  accentLight: '#F39C12',
  accentDark: '#D35400',

  // Background Colors
  background: '#F5F5F0',   // Off-white with earth tint
  surface: '#FFFFFF',
  surfaceSecondary: '#FAFAF5',

  // Text Colors
  text: '#2C3E50',          // Dark slate
  textSecondary: '#7F8C8D',
  textLight: '#BDC3C7',
  textOnPrimary: '#FFFFFF',
  textOnSecondary: '#2C3E50',

  // Status Colors
  success: '#27AE60',
  warning: '#F1C40F',
  error: '#E74C3C',
  info: '#3498DB',

  // Marketplace Colors
  available: '#27AE60',
  pending: '#F39C12',
  sold: '#95A5A6',

  // Livestock Status
  active: '#27AE60',
  sold_out: '#9B59B6',
  deceased: '#E74C3C',

  // Border & Dividers
  border: '#E0E0D8',
  divider: '#EEEEEA',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // White & Black
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  title: 28,
  header: 32,
};

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Crop Types Configuration
export const CROP_TYPES = [
  { id: 'maize', name: 'Maize', icon: '🌽', color: '#F1C40F' },
  { id: 'sorghum', name: 'Sorghum', icon: '🌾', color: '#D4A574' },
  { id: 'beans', name: 'Beans', icon: '🫘', color: '#8B4513' },
  { id: 'tomatoes', name: 'Tomatoes', icon: '🍅', color: '#E74C3C' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥬', color: '#27AE60' },
  { id: 'sunflower', name: 'Sunflower', icon: '🌻', color: '#F39C12' },
  { id: 'watermelon', name: 'Watermelon', icon: '🍉', color: '#E67E22' },
];

// Livestock Types Configuration
export const LIVESTOCK_TYPES = [
  { id: 'cattle', name: 'Cattle', icon: '🐄', color: '#8B4513' },
  { id: 'goats', name: 'Goats', icon: '🐐', color: '#A0522D' },
  { id: 'sheep', name: 'Sheep', icon: '🐑', color: '#F5F5DC' },
  { id: 'chickens', name: 'Chickens', icon: '🐔', color: '#FFA07A' },
  { id: 'pigs', name: 'Pigs', icon: '🐷', color: '#FFB6C1' },
];

// Marketplace Categories
export const MARKETPLACE_CATEGORIES = [
  { id: 'crops', name: 'Crops', icon: '🌾', color: '#27AE60' },
  { id: 'livestock', name: 'Livestock', icon: '🐄', color: '#8B4513' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥬', color: '#2ECC71' },
  { id: 'dairy', name: 'Dairy Products', icon: '🥛', color: '#FDF5E6' },
  { id: 'equipment', name: 'Farming Equipment', icon: '🚜', color: '#696969' },
  { id: 'seeds', name: 'Seeds', icon: '🌱', color: '#228B22' },
  { id: 'fertilizer', name: 'Fertilizer', icon: '🧪', color: '#9ACD32' },
];

// User Roles
export const USER_ROLES = [
  { id: 'farmer', name: 'Farmer', icon: '👨‍🌾' },
  { id: 'buyer', name: 'Buyer', icon: '🛒' },
  { id: 'supplier', name: 'Supplier', icon: '📦' },
  { id: 'admin', name: 'Admin', icon: '👨‍💼' },
];

// Delivery Options
export const DELIVERY_OPTIONS = [
  'Pickup',
  'Local Delivery',
  'Regional Delivery',
  'National Shipping',
];

// Payment Methods
export const PAYMENT_METHODS = [
  { id: 'orange_money', name: 'Orange Money', icon: '🟠' },
  { id: 'visa', name: 'Visa', icon: '💳' },
  { id: 'mastercard', name: 'Mastercard', icon: '💳' },
  { id: 'wallet', name: 'App Wallet', icon: '👛' },
];

// Weather Icons Mapping
export const WEATHER_ICONS: Record<string, string> = {
  sunny: '☀️',
  partly_cloudy: '⛅',
  cloudy: '☁️',
  rainy: '🌧️',
  thunderstorm: '⛈️',
  snowy: '❄️',
  windy: '💨',
  foggy: '🌫️',
};