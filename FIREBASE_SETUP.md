# Firebase Setup Guide - Temo Thuo Market

This guide walks you through connecting real Firebase services to the Temo Thuo Market app.

## Prerequisites
- A Google account
- Node.js 18+ installed
- Expo CLI (`npm install -g expo-cli`)

---

## Step 1: Create Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"**
3. Enter project name: `TemoThuoMarket`
4. Disable Google Analytics (optional for this app)
5. Click **"Create project"**
6. Wait for project to be provisioned

---

## Step 2: Register Android App

1. In Firebase console, click the **gear icon** → **Project Settings**
2. Scroll to **"Your apps"** section
3. Click **Android icon** (ₙ)
4. Fill in:
   - **Android package name**: `com.temothuomarket.app`
   - **App nickname**: `Temo Thuo Market`
   - **Debug signing certificate SHA-1**: (optional, for debug builds)
5. Click **"Register app"**
6. Download `google-services.json` → save to project root
7. Click **"Next"** → **"Continue"** → **"Skip"**

---

## Step 3: Register iOS App (for future iOS builds)

1. In Firebase console, go to **"Your apps"** → click **iOS icon**
2. Fill in:
   - **iOS bundle ID**: `com.temothuomarket.app`
   - **App ID**: Leave default or set custom
3. Download `GoogleService-Info.plist`
4. Open Xcode → drag into project
5. Click **"Next"** until complete

---

## Step 4: Enable Firebase Services

### Authentication
1. Go to **Authentication** → **Get started**
2. Enable these providers:

**Email/Password:**
- Click **Email/Password**
- Enable **Email/Password**
- Click **Save**

**Phone:**
- Click **Phone**
- Enable **Phone**
- Add test phone numbers (optional for dev)
- Click **Save**

### Firestore Database
1. Go to **Firestore Database** → **Create database**
2. Choose **"Start in test mode"** (dev) or **"Start in production mode"**
3. Select a location (closest to your users, e.g., `europe-west1`)
4. Click **Enable**

### Cloud Storage
1. Go to **Storage** → **Get started**
2. Choose **"Start in test mode"** (dev)
3. Select location
4. Click **Enable**

### Cloud Messaging (Push Notifications)
1. Go to **Messaging** → **Get started**
2. Upload APNs certificate (iOS) or configure FCM (Android)
3. For Android, the default FCM token is auto-configured

---

## Step 5: Configure Firestore Security Rules

Go to Firestore → **Rules** tab:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Crops (only owner can read/write)
    match /crops/{cropId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Livestock
    match /livestock/{livestockId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Products
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Posts
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Messages
    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Conversations
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null;
    }
    
    // Wallets & Transactions
    match /wallets/{walletId} {
      allow read, write: if request.auth != null;
    }
    
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Step 6: Update firebase.ts

Open `src/services/firebase.ts` and replace with your config:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';

// Your Firebase config from google-services.json
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "temothuomarket.firebaseapp.com",
  projectId: "temothuomarket",
  storageBucket: "temothuomarket.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:android:abc123"
};

const app = initializeApp(firebaseConfig);

export const getFirebaseAuth = () => getAuth(app);
export const getFirebaseDB = () => getFirestore(app);
export const getFirebaseStorage = () => getStorage(app);
export const getFirebaseMessaging = () => getMessaging(app);
```

---

## Step 7: Set Environment Variables

Create `.env` file (DO NOT commit this file):

```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

---

## Step 8: Build APK

### Local Build
```bash
# Install dependencies
npm install

# Generate Android native code
npx expo prebuild --platform android

# Build debug APK
cd android && ./gradlew assembleDebug
```

### Using EAS (Recommended)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build for Android
eas build --platform android --profile preview
```

---

## Firestore Collections

The app uses these Firestore collections:

| Collection | Purpose |
|------------|---------|
| `users` | User profiles, roles, farm info |
| `crops` | Crop records with planting/harvest data |
| `livestock` | Animal records with health/breeding |
| `products` | Marketplace product listings |
| `orders` | Purchase orders |
| `posts` | Social media posts |
| `comments` | Post comments |
| `conversations` | Messaging conversations |
| `messages` | Individual chat messages |
| `notifications` | Push notification records |
| `wallets` | User wallet balances |
| `transactions` | Payment transactions |
| `paymentMethods` | Saved payment methods |

---

## Testing

### Test Authentication
1. Add test email in Firebase Console → Authentication → Test users
2. Or enable **Email/Password** and register a real account

### Test Push Notifications
1. Send test notification from Firebase Console → Messaging
2. Or use Expo notifications in development

---

## Troubleshooting

**"No Firebase app has been created"**
- Run `npx expo prebuild --platform android` again
- Ensure `google-services.json` is in project root

**"403 Permission denied"**
- Update Firestore security rules
- Check Authentication is enabled

**Push notifications not working**
- Ensure `google-services.json` is the latest version
- Check Cloud Messaging is enabled
