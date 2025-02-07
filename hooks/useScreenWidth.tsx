'use client'

import { useEffect, useState } from 'react'

const useScreenWidth = () => {
    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

    

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        }

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Define responsive values based on screen width
    const isMobile = screenWidth < 768;
    const isTablet = screenWidth >= 768 && screenWidth < 1024;
    const isDesktop = screenWidth >= 1024;

    // Provide the context value
    return {
        screenWidth,
        isMobile,
        isTablet,
        isDesktop,
    };
}

export default useScreenWidth