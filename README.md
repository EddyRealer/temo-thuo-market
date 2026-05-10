# 🌾 Temo Thuo Market

> An African agriculture marketplace, farm management, and farmer social platform for Botswana and Africa.
> *Where Innovation meets Tradition, Feeding beyond Africa*

![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue)
![Expo](https://img.shields.io/badge/Expo-54.0-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Firebase](https://img.shields.io/badge/Firebase-12.0-orange)

---

## 📱 Overview

Temo Thuo Market is a comprehensive mobile app combining:
- **Marketplace** — Buy and sell crops, livestock, and farming products
- **Farm Management** — Track crops, livestock, irrigation, and vaccinations
- **Social Platform** — Connect with other farmers, share updates, join communities
- **Messaging** — Real-time buyer/seller conversations
- **Weather** — Local forecasts and farming recommendations
- **Payments** — Wallet, Orange Money, Visa/Mastercard support

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.81.5 | Mobile framework |
| Expo | 54.0 | Development platform |
| TypeScript | 5.9 | Type safety |
| Firebase | 12.0 | Backend (Auth, Firestore, Storage, Messaging) |
| React Navigation | 7.x | Navigation |
| AsyncStorage | 3.0 | Local persistence |

---

## ✨ Features

### Authentication
- Email/password login
- Phone number OTP verification
- Forgot password with OTP reset
- Role-based access (Farmer, Buyer, Supplier, Admin)

### Farmer Dashboard
- Farm overview with key statistics
- Weather widget with 7-day forecast
- Crop and livestock status at a glance
- Sales and expense tracking
- Profit/loss indicators
- Notifications badge

### Crop Management
- Add crops (Maize, Sorghum, Beans, Tomatoes, etc.)
- Track planting and harvest dates
- Irrigation schedules
- Fertilizer reminders
- Disease reports
- Photo documentation

### Livestock Management
- Add animals (Cattle, Goats, Sheep, Chickens, Pigs)
- Vaccination records and reminders
- Breeding history
- Weight tracking
- Health reports
- Sale records

### Marketplace
- Product listings by category
- Search and filter
- Product detail pages
- Shopping cart
- Checkout flow
- Delivery options
- Ratings and reviews

### Payment System
- In-app wallet (BWP)
- Orange Money integration
- Visa/Mastercard support
- Transaction history
- Payment notifications

### Social Media
- Farmer feed
- Photo and video posts
- Comments and likes
- Save posts
- Follow users
- Community groups

### Real-time Messaging
- One-on-one chat
- Image sharing
- Online status
- Typing indicators
- Read receipts

### Weather System
- Current conditions
- 7-day forecast
- Rain and drought alerts
- Farming recommendations

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android builds) OR Xcode (for iOS)
- Firebase project (see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md))

### Installation

```bash
# Clone or navigate to project
cd /home/team/shared/temo-thuo-market

# Install dependencies
npm install

# Start development server
npm start
```

### Running on Device/Emulator

```bash
# Android
npm run android

# iOS (requires Mac with Xcode)
npm run ios

# Web
npm run web
```

---

## 🔧 Build APK

### Method 1: Local Build

```bash
# Generate Android native project
npx expo prebuild --platform android

# Build debug APK
cd android && ./gradlew assembleDebug

# APK will be at: android/app/build/outputs/apk/debug/app-debug.apk
```

### Method 2: EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to EAS
eas login

# Build for Android (preview/internal)
eas build --platform android --profile preview

# Build for Android (production)
eas build --platform android --profile production
```

### Build Scripts

```bash
# Prebuild Android
npm run prebuild

# Build Android debug
npm run build:android

# Build Android release
npm run build:release
```

---

## 📁 Project Structure

```
temo-thuo-market/
├── App.tsx                    # Main app component
├── index.ts                   # Entry point
├── app.json                   # Expo configuration
├── package.json               # Dependencies
├── eas.json                  # EAS Build config
├── FIREBASE_SETUP.md         # Firebase setup guide
├── BUILD_INSTRUCTIONS.md     # Build documentation
├── .env.example              # Environment template
├── README.md                 # This file
├── assets/                   # Images, icons, fonts
│   ├── icon.png
│   ├── adaptive-icon.png
│   ├── splash-icon.png
│   └── favicon.png
├── src/
│   ├── components/           # Reusable UI components
│   │   └── common/           # Button, Input, Card, etc.
│   ├── constants/           # Theme, configs
│   │   └── theme.ts          # Colors, spacing, typography
│   ├── contexts/             # React Context providers
│   │   ├── AuthContext.tsx   # Authentication state
│   │   ├── CartContext.tsx   # Shopping cart
│   │   ├── WalletContext.tsx # Payment wallet
│   │   └── LanguageContext.tsx # i18n
│   ├── hooks/                # Custom React hooks
│   ├── navigation/            # React Navigation setup
│   │   ├── AppNavigator.tsx  # Main navigator
│   │   └── types.ts          # Navigation types
│   ├── screens/              # App screens by feature
│   │   ├── auth/             # Login, Register, etc.
│   │   ├── dashboard/        # Home dashboard
│   │   ├── crops/            # Crop management
│   │   ├── livestock/        # Animal management
│   │   ├── marketplace/      # Buy/sell products
│   │   ├── payments/         # Wallet, transactions
│   │   ├── messaging/        # Chat
│   │   ├── social/           # Posts, feed
│   │   ├── weather/          # Weather forecasts
│   │   ├── notifications/    # Alerts
│   │   ├── profile/          # User profile
│   │   ├── admin/            # Admin panel
│   │   └── settings/         # App settings
│   ├── services/             # Business logic & API
│   │   ├── firebase.ts      # Firebase init
│   │   ├── authService.ts   # Authentication
│   │   ├── firestoreService.ts # Database
│   │   ├── paymentService.ts # Payments
│   │   └── storageService.ts # File uploads
│   ├── types/                # TypeScript definitions
│   │   └── index.ts          # All type interfaces
│   └── utils/                # Helper functions
└── android/                   # Native Android project (generated)
```

---

## 🔐 Firebase Configuration

The app uses placeholder Firebase credentials. To connect your own Firebase project:

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Follow the detailed guide in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
3. Download `google-services.json` → place in project root
4. Update `src/services/firebase.ts` with your config
5. Or use `.env` file (see [`.env.example`](./.env.example))

---

## 🎨 Theme

The app uses an African agriculture-inspired color palette:

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Green | `#2D5A27` | Headers, buttons, accents |
| Secondary Brown | `#8B4513` | Secondary actions |
| Accent Orange | `#F57C00` | Highlights, badges |
| Background | `#F5F5DC` | App background (beige) |
| Surface | `#FFFFFF` | Cards, modals |
| Text | `#1A1A1A` | Primary text |
| Text Secondary | `#666666` | Secondary text |
| Success | `#4CAF50` | Success states |
| Warning | `#FFC107` | Warnings |
| Error | `#F44336` | Errors |

---

## 📱 Screens

| Screen | Path | Description |
|--------|------|-------------|
| Splash | / | Logo animation |
| Onboarding | /onboarding | 4-slide intro |
| Login | /login | Email/phone tabs |
| Register | /register | Account creation |
| Forgot Password | /forgot-password | OTP reset |
| Dashboard | /home | Farm overview |
| Marketplace | /marketplace | Product browsing |
| Product Detail | /product/:id | Product info |
| Add Product | /add-product | New listing |
| Cart | /cart | Shopping cart |
| Checkout | /checkout | Payment flow |
| Crop Management | /crops | Crop list |
| Add Crop | /add-crop | New crop |
| Livestock | /livestock | Animal list |
| Add Livestock | /add-livestock | New animal |
| Social Feed | /social | Posts feed |
| Create Post | /create-post | New post |
| Conversations | /messages | Chat list |
| Chat | /chat/:id | Messaging |
| Weather | /weather | Forecasts |
| Notifications | /notifications | Alerts |
| Wallet | /wallet | Balance & txns |
| Profile | /profile | User profile |
| Edit Profile | /edit-profile | Update info |
| Settings | /settings | Preferences |
| Admin | /admin | Moderation |

---

## 🌐 Multi-Language

The app supports:
- **English** (default)
- **Setswana** (Tswana language of Botswana)

Language can be changed in Settings.

---

## 📦 Dependencies

Core packages:
- `expo` ~54.0.33
- `react-native` 0.81.5
- `react` 19.1.0
- `firebase` ^12.13.0
- `@react-navigation/native` ^7.2.3
- `@react-navigation/bottom-tabs` ^7.15.12
- `@react-navigation/stack` ^7.8.12
- `react-native-safe-area-context` ^5.7.0
- `react-native-screens` ^4.24.0
- `react-native-gesture-handler` ^2.31.2
- `expo-image-picker` ^55.0.20
- `expo-location` ^55.1.9
- `expo-notifications` ^55.0.22
- `@react-native-async-storage/async-storage` ^3.0.2

---

## 🐛 Troubleshooting

### Metro bundler issues
```bash
npx react-native start --reset-cache
```

### Android build fails
```bash
cd android && ./gradlew clean
```

### Firebase connection issues
- Verify google-services.json is in project root
- Check package name matches Firebase config
- Ensure Authentication is enabled in Firebase Console

---

## 📄 License

Private project for Temo Thuo Market.

---

## 👥 Team

- **Tech Lead**: agent-tech-lead
- **Mobile Developer**: agent-mobile-developer
- **Project Manager**: agent-lead

---

*Built with ❤️ for African agriculture*
