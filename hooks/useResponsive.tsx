import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { debounce } from "../lib/utils";

// Define the context type
interface ResponsiveContextType {
  screenWidth: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// Create the context
const ResponsiveContext = createContext<ResponsiveContextType | undefined>(undefined);

// Define the provider props type
interface ResponsiveProviderProps {
  children: ReactNode;
}

// Create the provider component
export const ResponsiveProvider: React.FC<ResponsiveProviderProps> = ({ children }) => {
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = debounce(() => {
      setScreenWidth(window.innerWidth);
    }, 0);

    // Set initial screen width
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define responsive values based on screen width
  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;
  const isDesktop = screenWidth >= 1024;

  // Provide the context value
  const value: ResponsiveContextType = {
    screenWidth,
    isMobile,
    isTablet,
    isDesktop,
  };

  return <ResponsiveContext.Provider value={value}>{children}</ResponsiveContext.Provider>;
};

// Custom hook to consume the context
export const useResponsive = (): ResponsiveContextType => {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error("useResponsive must be used within a ResponsiveProvider");
  }
  return context;
};