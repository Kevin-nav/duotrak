import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowLeft, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useResponsiveBreakpoints } from '@/lib/hooks/useResponsiveBreakpoints';

export const GlobalTopNav = () => {
  const router = useRouter();
  const { isMobile, isTablet, isDesktop } = useResponsiveBreakpoints();

  if (isDesktop) {
    return null;
  }

  const showBackButton = router.pathname !== '/' && router.pathname !== '/dashboard';

  const handleBack = () => {
    router.back();
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-border/40 bg-solid-navbar-background shadow-sm",
      "py-2 px-3 sm:px-4"
    )}>
      <div className="container mx-auto flex items-center justify-between h-12 sm:h-14">
        <div className="flex items-center w-1/4">
          {showBackButton ? (
            <button
              onClick={handleBack}
              className="p-2 rounded-md hover:bg-black/5 active:bg-black/10 transition-colors text-primary-text-dark"
              aria-label="Go back"
            >
              <ArrowLeft size={22} />
            </button>
          ) : (
            <div className="w-9 sm:w-10">{/* Spacer */}</div>
          )}
        </div>

        <div className="flex items-center justify-center flex-grow">
          <Link href="/dashboard" className="flex items-center gap-1.5 sm:gap-2 group">
            <div className="relative h-7 w-7 sm:h-8 sm:w-8">
              <Image 
                src="/logo.png" 
                alt="DuoTrak Logo" 
                fill 
                sizes="(max-width: 640px) 28px, 32px"
                className="object-contain"
              />
            </div>
            <h1 className="text-lg sm:text-xl font-semibold text-duotrak-brand-text group-hover:opacity-80 transition-opacity">
              DuoTrak
            </h1>
          </Link>
        </div>

        <div className="flex items-center justify-end w-1/4">
          <Link href="/notifications" legacyBehavior>
            <a className="p-2 rounded-md hover:bg-black/5 active:bg-black/10 transition-colors text-primary-text-dark" aria-label="View notifications">
              <Bell size={22} />
            </a>
          </Link>
        </div>
      </div>
    </header>
  );
}; 