const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rootDir = path.resolve(__dirname, '..');
const mobileAssets = path.resolve(__dirname, 'assets');
const webPublic = path.resolve(rootDir, 'web-app/public');

// Base 200x200 crown SVG paths
const crownSvgFragment = `
  <defs>
    <linearGradient id="gGold" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff59d" />
      <stop offset="25%" stop-color="#ffd54f" />
      <stop offset="60%" stop-color="#f59e0b" />
      <stop offset="85%" stop-color="#b45309" />
      <stop offset="100%" stop-color="#78350f" />
    </linearGradient>
    <linearGradient id="gRim" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#92400e" />
      <stop offset="30%" stop-color="#fde047" />
      <stop offset="70%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#78350f" />
    </linearGradient>
    <linearGradient id="gVelvet" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#9333ea" />
      <stop offset="60%" stop-color="#6b21a8" />
      <stop offset="100%" stop-color="#3b0764" />
    </linearGradient>
    <radialGradient id="gRuby" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#fca5a5" />
      <stop offset="35%" stop-color="#ef4444" />
      <stop offset="75%" stop-color="#b91c1c" />
      <stop offset="100%" stop-color="#450a0a" />
    </radialGradient>
    <radialGradient id="gSapphire" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#bae6fd" />
      <stop offset="40%" stop-color="#0ea5e9" />
      <stop offset="80%" stop-color="#0369a1" />
      <stop offset="100%" stop-color="#082f49" />
    </radialGradient>
    <radialGradient id="gEmerald" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#bbf7d0" />
      <stop offset="40%" stop-color="#22c55e" />
      <stop offset="80%" stop-color="#15803d" />
      <stop offset="100%" stop-color="#052e16" />
    </radialGradient>
  </defs>

  <path d="M 45 130 C 45 75, 155 75, 155 130 Z" fill="url(#gVelvet)" stroke="#2e1065" stroke-width="5" />
  <path d="M 70 128 C 80 92, 90 92, 100 128" fill="none" stroke="#a855f7" stroke-width="3" stroke-linecap="round" opacity="0.6" />
  <path d="M 100 128 C 110 92, 120 92, 130 128" fill="none" stroke="#a855f7" stroke-width="3" stroke-linecap="round" opacity="0.6" />

  <path d="M 32 142 L 20 62 L 64 96 L 100 36 L 136 96 L 180 62 L 168 142 Z" fill="url(#gGold)" stroke="#451a03" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
  <path d="M 36 138 L 26 70 L 64 99 L 100 44 L 136 99 L 174 70 L 164 138 Z" fill="none" stroke="#fef08a" stroke-width="2.5" opacity="0.75" />

  <rect x="24" y="136" width="152" height="26" rx="8" fill="url(#gRim)" stroke="#451a03" stroke-width="6" />

  <circle cx="20" cy="60" r="10" fill="#ffffff" stroke="#78350f" stroke-width="3.5" />
  <circle cx="17" cy="57" r="3" fill="#ffffff" />
  <circle cx="64" cy="94" r="8" fill="url(#gSapphire)" stroke="#0c4a6e" stroke-width="3" />
  <circle cx="100" cy="34" r="12" fill="#ffffff" stroke="#78350f" stroke-width="4" />
  <circle cx="96" cy="30" r="4" fill="#ffffff" />
  <circle cx="136" cy="94" r="8" fill="url(#gEmerald)" stroke="#064e3b" stroke-width="3" />
  <circle cx="180" cy="60" r="10" fill="#ffffff" stroke="#78350f" stroke-width="3.5" />
  <circle cx="177" cy="57" r="3" fill="#ffffff" />

  <ellipse cx="100" cy="149" rx="14" ry="9" fill="url(#gRuby)" stroke="#450a0a" stroke-width="3" />
  <ellipse cx="98" cy="147" rx="5" ry="3" fill="#fecaca" opacity="0.6" />
  <ellipse cx="60" cy="149" rx="10" ry="7" fill="url(#gSapphire)" stroke="#082f49" stroke-width="2.5" />
  <ellipse cx="140" cy="149" rx="10" ry="7" fill="url(#gSapphire)" stroke="#082f49" stroke-width="2.5" />
`;

// 1. App Icon SVG (1024x1024)
const appIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#2d1552" />
      <stop offset="70%" stop-color="#160c2b" />
      <stop offset="100%" stop-color="#0c0617" />
    </radialGradient>
    <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#78350f" />
    </linearGradient>
  </defs>

  <!-- Background Card -->
  <rect width="1024" height="1024" fill="url(#bgGrad)" />

  <!-- Outer Beveled Border -->
  <rect x="32" y="32" width="960" height="960" rx="200" fill="none" stroke="url(#goldBorder)" stroke-width="24" opacity="0.85" />
  <rect x="56" y="56" width="912" height="912" rx="176" fill="none" stroke="#fef08a" stroke-width="4" opacity="0.4" />

  <!-- Chessboard Grid Pattern subtle in background -->
  <g opacity="0.08">
    <rect x="212" y="212" width="150" height="150" fill="#ffffff" />
    <rect x="512" y="212" width="150" height="150" fill="#ffffff" />
    <rect x="362" y="362" width="150" height="150" fill="#ffffff" />
    <rect x="662" y="362" width="150" height="150" fill="#ffffff" />
    <rect x="212" y="512" width="150" height="150" fill="#ffffff" />
    <rect x="512" y="512" width="150" height="150" fill="#ffffff" />
    <rect x="362" y="662" width="150" height="150" fill="#ffffff" />
    <rect x="662" y="662" width="150" height="150" fill="#ffffff" />
  </g>

  <!-- Giant Crown in Center -->
  <g transform="translate(162, 162) scale(3.5)">
    ${crownSvgFragment}
  </g>
</svg>
`;

// 2. Android Adaptive Foreground (512x512)
const adaptiveForegroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <g transform="translate(81, 81) scale(1.75)">
    ${crownSvgFragment}
  </g>
</svg>
`;

// 3. Android Adaptive Background (512x512)
const adaptiveBackgroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#160c2b" />
</svg>
`;

// 4. OpenGraph Social Share Card (1200x630)
const ogImageSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <radialGradient id="ogBg" cx="30%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#34175e" />
      <stop offset="60%" stop-color="#160c2b" />
      <stop offset="100%" stop-color="#090412" />
    </radialGradient>
    <linearGradient id="ogGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#ogBg)" />

  <!-- Frame border -->
  <rect x="20" y="20" width="1160" height="590" rx="32" fill="none" stroke="#4a2580" stroke-width="4" />
  <rect x="28" y="28" width="1144" height="574" rx="24" fill="none" stroke="#f59e0b" stroke-width="2" opacity="0.5" />

  <!-- Crown on Left -->
  <g transform="translate(90, 115) scale(2.0)">
    ${crownSvgFragment}
  </g>

  <!-- Typography on Right -->
  <g transform="translate(560, 180)">
    <!-- Badge -->
    <rect x="0" y="0" width="220" height="38" rx="19" fill="#3b0764" stroke="#7e22ce" stroke-width="2" />
    <text x="110" y="24" fill="#fde047" font-family="system-ui, sans-serif" font-size="14" font-weight="900" text-anchor="middle" letter-spacing="2">ROYAL CHESS PUZZLE</text>

    <!-- Main Title -->
    <text x="0" y="110" fill="url(#ogGold)" font-family="system-ui, sans-serif" font-size="76" font-weight="900" letter-spacing="4">N-QUEENS</text>

    <!-- Subtitle -->
    <text x="0" y="165" fill="#e9d5ff" font-family="system-ui, sans-serif" font-size="24" font-weight="700">Can You Command The Board Without Conflict?</text>

    <!-- Highlights Row -->
    <g transform="translate(0, 220)">
      <rect x="0" y="0" width="160" height="44" rx="14" fill="#1e1038" stroke="#4c1d95" stroke-width="2" />
      <text x="80" y="28" fill="#67e8f9" font-family="system-ui, sans-serif" font-size="14" font-weight="800" text-anchor="middle">⚡ 60fps Native</text>

      <rect x="175" y="0" width="160" height="44" rx="14" fill="#1e1038" stroke="#4c1d95" stroke-width="2" />
      <text x="255" y="28" fill="#4ade80" font-family="system-ui, sans-serif" font-size="14" font-weight="800" text-anchor="middle">📅 Daily Puzzles</text>

      <rect x="350" y="0" width="160" height="44" rx="14" fill="#1e1038" stroke="#4c1d95" stroke-width="2" />
      <text x="430" y="28" fill="#facc15" font-family="system-ui, sans-serif" font-size="14" font-weight="800" text-anchor="middle">💡 Smart Hints</text>
    </g>
  </g>
</svg>
`;

async function generateAll() {
  console.log('Generating mobile and web assets via sharp...');

  // 1. Mobile App Icon (1024x1024)
  await sharp(Buffer.from(appIconSvg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(mobileAssets, 'icon.png'));
  console.log('Created mobile-app/assets/icon.png');

  // 2. Android Adaptive Foreground (512x512)
  await sharp(Buffer.from(adaptiveForegroundSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(mobileAssets, 'android-icon-foreground.png'));
  console.log('Created mobile-app/assets/android-icon-foreground.png');

  // 3. Android Adaptive Background (512x512)
  await sharp(Buffer.from(adaptiveBackgroundSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(mobileAssets, 'android-icon-background.png'));
  console.log('Created mobile-app/assets/android-icon-background.png');

  // 4. Mobile Splash Icon (512x512)
  await sharp(Buffer.from(adaptiveForegroundSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(mobileAssets, 'splash-icon.png'));
  console.log('Created mobile-app/assets/splash-icon.png');

  // 5. Mobile Favicon (48x48)
  await sharp(Buffer.from(adaptiveForegroundSvg))
    .resize(48, 48)
    .png()
    .toFile(path.join(mobileAssets, 'favicon.png'));
  console.log('Created mobile-app/assets/favicon.png');

  // 6. Web OG Image (1200x630)
  await sharp(Buffer.from(ogImageSvg))
    .resize(1200, 630)
    .png()
    .toFile(path.join(webPublic, 'og-image.png'));
  console.log('Created web-app/public/og-image.png');

  // 7. Web Apple Touch Icon (180x180)
  await sharp(Buffer.from(appIconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(webPublic, 'apple-touch-icon.png'));
  console.log('Created web-app/public/apple-touch-icon.png');

  // 8. Web Favicon 32x32 PNG
  await sharp(Buffer.from(appIconSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(webPublic, 'favicon.ico'));
  console.log('Created web-app/public/favicon.ico');

  console.log('All branding visual assets generated successfully!');
}

generateAll().catch(console.error);
