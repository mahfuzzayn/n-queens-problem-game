# Google Play Store & Mobile Deployment Guide

> **Project:** N-Queens Puzzle Game  
> **Package Name:** `com.nqueens.game`  
> **Target Platforms:** Android & iOS (React Native / Expo SDK 58)  
> **Aesthetic:** Cartoon Fantasy Strategy (Clash of Clans style)

---

## 1. Running Locally on Android

### Option A: Expo Go (Instant Testing — No Android SDK needed)
1. Install **Expo Go** on your Android phone from the [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent).
2. Ensure your phone and development computer are connected to the same Wi-Fi network.
3. In your terminal, navigate to `mobile-app/` and start the server:
   ```bash
   cd mobile-app
   npx expo start -c
   ```
4. Scan the displayed QR code with the Expo Go app. The app bundles and runs live with instant fast refresh!

### Option B: Local Android Emulator / USB Debugging
1. Connect your Android phone with **USB Debugging** enabled (under Developer Options) or start an Android Studio AVD emulator.
2. In `mobile-app/`, run:
   ```bash
   npx expo run:android
   ```

---

## 2. Running Locally on iOS

### Option A: Expo Go on iPhone
1. Install **Expo Go** from the iOS App Store.
2. In `mobile-app/`, run:
   ```bash
   cd mobile-app
   npx expo start -c
   ```
3. Open the iOS **Camera** app, scan the QR code in the terminal, and tap "Open in Expo Go".

### Option B: iOS Simulator (macOS only)
1. Open Terminal on macOS:
   ```bash
   cd mobile-app
   npx expo run:ios
   ```

---

## 3. Building Standalone Android APK (for Direct Testing & Sideloading)

### Method 1: EAS Cloud Build (Recommended — No Local SDK Required)
Expo Application Services (EAS) builds your APK in the cloud for free without needing Java or Android Studio installed locally.

1. Run the build command:
   ```bash
   cd mobile-app
   ./build-apk.sh eas
   # Or directly:
   npx eas-cli build --platform android --profile preview
   ```
2. Log in with your free Expo account when prompted.
3. EAS will compile the standalone `.apk` and output a direct download link and QR code.
4. Download and install the `.apk` directly on any Android device!

### Method 2: Local Gradle Build (Requires OpenJDK 17 + Android SDK)
If you have Java and Android SDK configured locally on your host machine:

1. Run the local build script:
   ```bash
   cd mobile-app
   ./build-apk.sh local
   ```
2. The compiled APK will be located at:
   ```
   mobile-app/android/app/build/outputs/apk/debug/app-debug.apk
   ```
3. Transfer and install via ADB:
   ```bash
   adb install -r android/app/build/outputs/apk/debug/app-debug.apk
   ```

---

## 4. Google Play Store Submission Guide (Production AAB)

Google Play requires the **Android App Bundle (`.aab`)** format for all new app releases.

### Step 1: Generate Production App Bundle (`.aab`)
Run the production build:
```bash
cd mobile-app
./build-apk.sh playstore
# Or directly:
npx eas-cli build --platform android --profile production
```
EAS will generate a signed, release-optimized `.aab` file ready for the Play Console.

### Step 2: Set Up Google Play Console
1. Log in to [Google Play Console](https://play.google.com/console).
2. Click **Create app**:
   - **App name:** `N-Queens: Royal Chess Puzzle`
   - **Default language:** `English (United States)`
   - **App or game:** `Game`
   - **Free or paid:** `Free`
3. Accept the declarations and click **Create app**.

### Step 3: Store Listing & Branding Assets
In the **Main store listing** tab, upload the custom branding assets already prepared in `mobile-app/assets/`:
- **App icon (512×512 PNG):** [`mobile-app/assets/android-icon-foreground.png`](../mobile-app/assets/android-icon-foreground.png)
- **Feature graphic (1024×500 PNG):** [`web-app/public/og-image.png`](../web-app/public/og-image.png)
- **Short description (up to 80 chars):**  
  `Master the legendary N-Queens chess puzzle with daily challenges & smart hints!`
- **Full description:**  
  Use the complete description highlighting the Clash of Clans aesthetic, responsive chessboards ($N=4$ to $12$), proof simulator for $N=2/3$, star ratings, streaks, and tactile haptic feedback.
- **Phone screenshots:** Take 4–8 in-game screenshots from the Android emulator or device (Splash screen, $8\times8$ board with placed queens, Victory modal with 3 stars, Settings sheet).

### Step 4: Content Rating & Privacy Policy
1. **Privacy Policy:** Link to your hosted privacy policy page (or host on GitHub Pages/Vercel).
2. **Target Audience:** Complete the declaration (e.g. 13+ / Everyone).
3. **Content Rating Questionnaire:** Fill out the IARC questionnaire (N-Queens contains zero violence, gambling, or adult content; qualifies for PEGI 3 / Everyone).

### Step 5: Upload App Bundle & Rollout
1. Go to **Release** → **Production** (or **Closed testing** for an internal test track first).
2. Click **Create new release**.
3. Upload the `.aab` bundle downloaded from Step 1.
4. Enter release notes (e.g. `v1.0.0 — Initial launch of N-Queens with Daily Puzzles, Star Ratings, and Offline Play`).
5. Click **Next** → **Save** → **Review release** → **Start rollout to Production**!

Google Play typically reviews new apps within 24 to 72 hours.
