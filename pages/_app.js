import "@/styles/globals.css";
import { Inter } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';
import { StagewiseToolbar } from '@stagewise/toolbar-next';

import { AuthProvider } from '@/context/AuthContext';
import { useResponsiveBreakpoints } from '@/lib/hooks/useResponsiveBreakpoints';
import { MobileTabLayout } from '@/components/layout/MobileTabLayout';
import { DesktopTopNavLayout } from '@/components/layout/DesktopTopNavLayout';
import { GlobalTopNav } from '@/components/layout/GlobalTopNav';

// Configure the Inter font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // This will be the CSS variable name
  display: 'swap', // Recommended for performance
});

// Stagewise Toolbar Configuration
const stagewiseConfig = {
  plugins: []
};

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const { isMobile, isTablet, isDesktop } = useResponsiveBreakpoints();

  let LayoutComponent;
  if (isDesktop) {
    LayoutComponent = DesktopTopNavLayout;
  } else {
    LayoutComponent = MobileTabLayout;
  }

  useEffect(() => {
    // Apply the font variable to the html element
    document.documentElement.style.setProperty('--font-inter', inter.variable);
  }, []);

  const pageVariants = {
    initialState: {
      opacity: 0,
      y: 15, // Start slightly lower
      // clipPath: 'inset(0% 50% 0% 50% round 10px)' // Removing clipPath for simpler fade/slide
    },
    animateState: {
      opacity: 1,
      y: 0,    // Animate to original position
      // clipPath: 'inset(0% 0% 0% 0% round 10px)'
    },
    exitState: {
      opacity: 0,
      y: -15, // Exit slightly higher
      // clipPath: 'inset(0% 50% 0% 50% round 10px)'
    },
  };

  return (
    <AuthProvider>
      {process.env.NODE_ENV === 'development' && <StagewiseToolbar config={stagewiseConfig} />}
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <GlobalTopNav />
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.div
          key={router.route} // Ensures re-animation on route change
          initial="initialState"
          animate="animateState"
          exit="exitState"
          transition={{ duration: 0.3, ease: "easeInOut" }}
          variants={pageVariants} // Use the new variants
          className="flex flex-col flex-grow" // Changed min-h-screen to flex-grow for better layout with GlobalTopNav
        >
          <LayoutComponent>
            <Component {...pageProps} />
          </LayoutComponent>
        </motion.div>
      </AnimatePresence>
      <Toaster richColors closeButton />
    </AuthProvider>
  );
}
