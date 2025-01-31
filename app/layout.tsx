import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import { baseUserSchema } from "@/lib/schema";
import { z } from "zod";

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

export default async function RootLayout({
  admin,
  driver,
  passenger,
  children
}: Readonly<{
  admin: React.ReactNode;
  driver: React.ReactNode;
  passenger: React.ReactNode;
  children: React.ReactNode;
}>) {
  const cookiesStore = await cookies();
  const user = cookiesStore.get('auth')

  const renderPageByRole = () => {

    if (!user) return children;

    const decodedUser = jwt.decode(user?.value) as z.infer<typeof baseUserSchema>;

    console.log('decodedUser', decodedUser)

    switch (decodedUser.roleId) {
      case 1: return admin;
      case 2: return driver;
      case 3: return passenger;
      default: return children;
    }
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {renderPageByRole()}
      </body>
    </html>
  );
}
