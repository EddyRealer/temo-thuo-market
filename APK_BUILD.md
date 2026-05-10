# Android APK Build Guide - Temo Thuo Market

## Build Status
- ✅ Expo prebuild completed (android/ directory generated)
- ⚠️ APK build pending (Java not installed in environment)

## Build Commands

### Step 1: Install Java (JDK 17 recommended)
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk

# Set JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
```

### Step 2: Build Debug APK
```bash
cd /home/team/shared/temo-thuo-market

# If not already done, generate android directory
npx expo prebuild --platform android

# Build debug APK
cd android
./gradlew assembleDebug

# APK output location:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### Step 3: Build Release APK
```bash
cd android
./gradlew assembleRelease

# Release APK output:
# android/app/build/outputs/apk/release/app-release.apk
```

## Prebuild Completed
The `npx expo prebuild --platform android` command has already been run successfully:
- android/ directory created
- build.gradle configured with package `com.temothuomarket.app`
- gradle wrapper installed (gradlew executable)
- app/build.gradle set up

## Asset Verification (Completed)
All required assets exist in assets/:
- ✅ icon.png (22,380 bytes)
- ✅ adaptive-icon.png (17,547 bytes)
- ✅ splash-icon.png (17,547 bytes)
- ✅ favicon.png (1,466 bytes)

Splash background color: #2D5A27 (primary green)

## Build Output Paths
| Build Type | Output Path |
|------------|-------------|
| Debug APK | `android/app/build/outputs/apk/debug/app-debug.apk` |
| Release APK | `android/app/build/outputs/apk/release/app-release.apk` |

## Environment Requirements
- Node.js 18+
- Java JDK 17 (JAVA_HOME set)
- Android SDK (if building locally)
- For EAS Build: `npm install -g eas-cli && eas login`

## EAS Build Alternative (Recommended)
If local Java is not available, use EAS:
```bash
cd /home/team/shared/temo-thuo-market
eas build --platform android --profile preview
```

## Troubleshooting

### "JAVA_HOME is not set"
```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
```

### "Gradle build failed"
```bash
cd android && ./gradlew clean
./gradlew assembleDebug --stacktrace
```

### "expo prebuild not found"
```bash
npm install
npx expo prebuild --platform android
```

## Notes
- The android/ directory was generated using Expo SDK 54 prebuild
- Build TypeScript verification: `npm run type-check`
- Lint: `npm run lint`