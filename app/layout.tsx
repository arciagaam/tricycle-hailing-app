import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import { baseUserSchema } from "@/lib/schema";
import { z } from "zod";
import { Toaster } from "react-hot-toast";

const redHatDisplay = Red_Hat_Display({
  variable: "--font-red-hat",
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

    switch (decodedUser.roleId) {
      case 1: return admin;
      case 2: return driver;
      case 3: return passenger;
      default: return children;
    }
  }

  return (
    <html lang="en">
      <body className={`${redHatDisplay.variable} ${redHatDisplay.className} antialiased font-red-hat`}>
        <Toaster />
        <div className="flex items-center justify-center">
          {renderPageByRole()}
        </div>
      </body>
    </html>
  );
}
