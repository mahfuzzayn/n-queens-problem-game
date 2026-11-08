#!/usr/bin/env bash
# ==============================================================================
# N-Queens Game — Android APK Build Script
# ==============================================================================
set -e

echo "👑 N-Queens Puzzle Game — Android Build Tool"
echo "============================================="

CHOICE=${1:-"help"}

if [ "$CHOICE" = "local" ]; then
    echo "🔨 Building APK locally via Gradle..."
    if ! command -v java &> /dev/null; then
        echo "❌ Java JDK is not installed or not in PATH."
        echo "👉 Please install OpenJDK 17: sudo apt install openjdk-17-jdk"
        exit 1
    fi
    cd android
    ./gradlew assembleDebug
    echo "✅ Debug APK generated at:"
    echo "👉 $(pwd)/app/build/outputs/apk/debug/app-debug.apk"
elif [ "$CHOICE" = "release" ]; then
    echo "🔨 Building Signed Release APK locally via Gradle..."
    cd android
    ./gradlew assembleRelease
    echo "✅ Release APK generated at:"
    echo "👉 $(pwd)/app/build/outputs/apk/release/app-release.apk"
elif [ "$CHOICE" = "eas" ]; then
    echo "☁️ Building standalone APK via EAS Cloud Build (free, no local SDK needed)..."
    npx eas-cli build --platform android --profile preview
elif [ "$CHOICE" = "playstore" ]; then
    echo "🚀 Building production AAB for Google Play Store via EAS..."
    npx eas-cli build --platform android --profile production
else
    echo "Usage:"
    echo "  ./build-apk.sh eas        # (Recommended) Builds standalone APK via EAS Cloud Build (generates download link + QR)"
    echo "  ./build-apk.sh local      # Builds Debug APK locally via Gradle (requires JDK 17 & Android SDK)"
    echo "  ./build-apk.sh release    # Builds Release APK locally via Gradle"
    echo "  ./build-apk.sh playstore  # Builds signed AAB bundle for Google Play Store"
fi
