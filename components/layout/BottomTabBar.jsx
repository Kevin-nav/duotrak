import { cn } from '@/lib/utils';

export function BottomTabBar({ children }) {
  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 flex h-16 items-stretch border-t border-disabled-text-border-light bg-navbar-background shadow-lg md:hidden", // Changed to bg-navbar-background
      )}
    >
      {children}
    </nav>
  );
} 