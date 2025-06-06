import React from 'react';
import { useResponsiveBreakpoints } from '@/lib/hooks/useResponsiveBreakpoints';
import { BottomTabBar } from './BottomTabBar';
import { BottomTabItem } from './BottomTabItem';
import { Home, Users, Target, Settings } from 'lucide-react'; // Example icons
// Import BottomTabItem if you intend to define the tabs structure directly here
// import { BottomTabItem } from './BottomTabItem';
// Example icons:
// import { Home, BarChart2, Users, Settings } from 'lucide-react';

export function MobileTabLayout({ children }) {
  const { isMobile, isTablet } = useResponsiveBreakpoints();

  // Define tab items - this would typically come from a config or props
  const tabItems = [
    { href: "/dashboard", label: "Home", IconComponent: Home },
    { href: "/goals", label: "Goals", IconComponent: Target },
    { href: "/partnership", label: "Partner", IconComponent: Users },
    { href: "/settings", label: "Settings", IconComponent: Settings },
  ];

  if (!isMobile && !isTablet) {
    return null; // Don't render this layout on desktop
  }

  return (
    <>
      <div className="pb-16"> {/* Add padding to bottom of content to avoid overlap with BottomTabBar */}
        {children}
      </div>
      <footer>
        <BottomTabBar>
          {tabItems.map((item) => (
            <BottomTabItem 
              key={item.href} 
              href={item.href} 
              label={item.label} 
              IconComponent={item.IconComponent} 
            />
          ))}
        </BottomTabBar>
      </footer>
    </>
  );
} 