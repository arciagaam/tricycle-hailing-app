import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tricycle Hailing App"
};

export default function RootLayout({
  admin,
  driver,
  passenger,
}: Readonly<{
  admin: React.ReactNode;
  driver: React.ReactNode;
  passenger: React.ReactNode;
}>) {

  const role: number = 3;

  const renderPageByRole = () => {
    switch (role) {
      case 1: return admin;
      case 2: return driver;
      case 3: return passenger;
    }
  }
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        { renderPageByRole() }
      </body>
    </html>
  );
}
