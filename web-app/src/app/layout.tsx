import type { Metadata, Viewport } from "next";
import { Lilita_One, Nunito } from "next/font/google";
import "./globals.css";

const lilitaOne = Lilita_One({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#160c2b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nqueens.app"),
  title: "N-Queens — Royal Chess Strategy & Puzzle Game",
  description:
    "Master the legendary N-Queens puzzle in a juicy, cartoon fantasy strategy game. Place queens without conflict, beat par times, solve daily seeded challenges, and unlock achievements!",
  keywords: [
    "N-Queens",
    "Chess Puzzle",
    "Backtracking Solver",
    "Strategy Game",
    "Clash of Clans aesthetic",
    "Daily Puzzle",
    "Algorithm Puzzle",
    "Puzzle Game",
  ],
  authors: [{ name: "Antigravity Engineering" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "N-Queens — Royal Chess Strategy & Puzzle Game",
    description:
      "Can you command the board without conflict? Play N-Queens with daily seeded puzzles, star ratings, and real-time conflict tracking.",
    type: "website",
    locale: "en_US",
    siteName: "N-Queens Puzzle",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "N-Queens Royal Chess Puzzle Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "N-Queens — Royal Chess Strategy & Puzzle Game",
    description: "Can you place N queens without any conflicts? Play now in your browser or on mobile!",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lilitaOne.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#160c2b] text-white select-none">
        {children}
      </body>
    </html>
  );
}
