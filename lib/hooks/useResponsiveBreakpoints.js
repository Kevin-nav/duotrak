import { useState, useEffect } from 'react';

// Breakpoint values from tailwind.config.js (md: 768px, lg: 1024px)
// It's generally better to get these from a single source of truth if possible,
// but for this hook, we'll define them based on the PRD and our Tailwind config.
const breakpoints = {
  tablet: 768,
  desktop: 1024,
};

export function useResponsiveBreakpoints() {
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < breakpoints.tablet,
        isTablet: width >= breakpoints.tablet && width < breakpoints.desktop,
        isDesktop: width >= breakpoints.desktop,
      });
    };

    // Check on initial mount
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  return screenSize;
} 