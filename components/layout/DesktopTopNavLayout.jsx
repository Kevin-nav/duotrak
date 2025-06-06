import React from 'react';
import { useResponsiveBreakpoints } from '@/lib/hooks/useResponsiveBreakpoints';
import { TopNavBar } from './TopNavBar';

export function DesktopTopNavLayout({ children }) {
  const { isDesktop } = useResponsiveBreakpoints();

  if (!isDesktop) {
    return null; // Don't render this layout on mobile/tablet
  }

  return (
    <>
      <header>
        <TopNavBar />
      </header>
      <div className="pt-16"> {/* Add padding to top of content to avoid overlap with TopNavBar */}
        {children}
      </div>
    </>
  );
} 