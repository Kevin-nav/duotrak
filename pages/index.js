import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext'; // Assuming this is your auth context path
import { motion } from 'framer-motion';

// TODO: Replace with the actual background color of your logo.png
const LOGO_BACKGROUND_COLOR = '#F5EFE0'; 
const ANIMATION_DURATION_MS = 2500; // 2.5 seconds

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, ANIMATION_DURATION_MS);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAnimating && !authLoading) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/auth/login');
      }
    }
  }, [isAnimating, authLoading, isAuthenticated, router]);

  return (
    <div
      style={{ backgroundColor: LOGO_BACKGROUND_COLOR }}
      className="flex flex-col items-center justify-center min-h-screen w-full"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
    >
        {/* Ensure logo.png is in the /public directory */}
        <Image
          src="/logo.png" 
          alt="DuoTrak Logo"
          width={200} // Adjust width as needed
          height={200} // Adjust height as needed
          priority
          className="object-contain"
        />
      </motion.div>
      {(isAnimating || authLoading) && (
        <motion.p 
          initial={{ opacity: 0}} 
          animate={{ opacity: 1}} 
          transition={{delay: 1, duration: 0.5}}
          className="mt-4 text-sm text-gray-700"
          style={{ color: '#6b4f34' }} // Darker text color for contrast with beige
        >
          Loading your DuoTrak experience...
        </motion.p>
      )}
    </div>
  );
}
