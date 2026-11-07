import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "N-Queens — The Classic Puzzle Game",
  description:
    "Place N queens on an N×N chessboard so that no two queens attack each other. A fun, game-style puzzle with campaign mode, daily challenges, and more!",
  openGraph: {
    title: "N-Queens — The Classic Puzzle Game",
    description:
      "Place N queens on an N×N chessboard so that no two queens attack each other.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${lilitaOne.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
