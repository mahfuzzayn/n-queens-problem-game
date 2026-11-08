# N-Queens Game — Mobile App (Phase 2)

## Overview
This directory contains the full **React Native (Expo SDK 58)** mobile application for the N-Queens puzzle game. It replicates the cartoon fantasy strategy visual aesthetic (Clash of Clans style) and achieves zero code duplication by directly sharing the pure TypeScript core algorithms and game configurations from `web-app/`.

## Architecture & Code Sharing
- **Zero Code Duplication:** Reuses `web-app/src/core/`, `web-app/src/config/`, and `web-app/src/types/` directly via symlinks and Metro configuration (`unstable_enableSymlinks = true`, `watchFolders`).
- **State Management:** Zustand store mirroring web store actions, plugged into native device adapters.
- **Persistence:** `@react-native-async-storage/async-storage` via `AsyncStorageAdapter`.
- **Audio Feedback:** `expo-audio` with in-memory synthesized PCM WAV tones for zero external asset dependencies and 100% offline reliability. Defensive loading guarantees zero crashes even in environments without native audio bindings.
- **Haptic Vibrations:** `expo-haptics` with light tap, medium impact, error notification, and victory success patterns.
- **Animations:** `react-native-reanimated` running micro-animations on the native UI thread (3D button press sink-down, modal popups, queen placement, conflict bounce).
- **Vector Graphics:** `react-native-svg` for the glossy Queen crown, jewels, and accents.
- **Edge-to-Edge Safe Area:** `react-native-safe-area-context` handling notches, Dynamic Island, and navigation bars.

## Mobile Responsiveness
- Dynamically calculates chessboard cell sizes using `useWindowDimensions`.
- Scales seamlessly from small 360dp Android devices up to large tablets.
- For large board sizes ($N > 8$), board frame enables smooth horizontal scrolling so touch targets remain comfortable to tap.

## How to Run & Build APK

```bash
# Navigate to mobile-app
cd mobile-app

# Run unit tests
npm test

# Start Expo dev server
npx expo start -c

# Build Standalone APK (via EAS Cloud — free, no local Android SDK needed):
./build-apk.sh eas

# Build Local Debug APK via Gradle (requires JDK 17 & Android SDK):
./build-apk.sh local

# Build Production AAB for Google Play Store:
./build-apk.sh playstore
```

See [`web-app/docs/playstore.md`](../web-app/docs/playstore.md) for the complete Google Play Store publishing guide and local emulator instructions.

## Production Verification
- **TypeScript Check:** `npx tsc --noEmit` (0 errors)
- **Unit Tests:** `npm test` (7/7 tests passing)
- **Production Bundler:** `EXPO_NO_TELEMETRY=1 npx expo export --platform android` (1145 modules bundled into Hermes bytecode with exit code 0)
