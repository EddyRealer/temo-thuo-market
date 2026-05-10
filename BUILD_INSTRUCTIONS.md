# Temo Thuo Market - Build & Export Configuration

## Project Overview
Temo Thuo Market is an African agriculture marketplace, farm management, and farmer social platform built with React Native + Expo + Firebase.

## Build Configuration Files

### app.json
Expo configuration with Android package name (`com.temothuomarket.app`) and iOS bundle identifier (`com.temothuomarket.app`).

### eas.json
EAS Build configuration for:
- **development**: Simulator builds for iOS
- **preview**: Internal distribution APK for Android
- **production**: Release APK for Google Play Store

### tsconfig.json
TypeScript configuration with strict mode enabled.

## Firebase Configuration

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Add Android app with package: `com.temothuomarket.app`
3. Add iOS app with bundle ID: `com.temothuomarket.app`
4. Download `google-services.json` and place in project root
5. Enable Authentication (Email/Password and Phone providers)
6. Create Firestore database
7. Update `src/services/firebase.ts` with your config

## Environment Setup

```bash
# Install dependencies
npm install

# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

## Building for Production

### Local Development Build (Android)
```bash
npx expo prebuild --platform android
cd android && ./gradlew assembleDebug
```

### EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to EAS
eas login

# Build for Android (APK)
eas build --platform android --profile preview

# Build for Android (Production)
eas build --platform android --profile production

# Build for iOS (requires Apple Developer account)
eas build --platform ios --profile production
```

## Output Locations

- **Local Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **EAS Build APK**: Download from EAS dashboard link
- **iOS Simulator**: Build artifact location shown after build

## Required Permissions (Android)

The app requests these permissions:
- CAMERA - For product photos, crop photos
- READ/WRITE_EXTERNAL_STORAGE - Image uploads
- ACCESS_FINE_LOCATION - Weather updates, farm mapping
- INTERNET - API calls, Firebase
- VIBRATE - Notifications
- RECEIVE_BOOT_COMPLETED - Background notifications

## Splash Screen

The splash screen uses the primary green color (#2D5A27). Ensure your splash-icon.png is present in the assets folder.

## Build Notes

- Expo SDK 54 with React Native 0.81.5
- TypeScript 5.9 with strict mode
- Firebase 12.x
- React Navigation 7.x