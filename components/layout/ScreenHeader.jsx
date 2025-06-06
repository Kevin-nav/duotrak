import React from 'react';
import Link from 'next/link';
import { ChevronLeft, MoreHorizontal } from 'lucide-react'; // Example icons
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // Assuming our customized button
// import { useResponsiveBreakpoints } from '@/lib/hooks/useResponsiveBreakpoints'; // If complex responsive logic is needed within header itself

// BreadcrumbItem component (can be moved to a separate file if it grows)
const BreadcrumbItem = ({ href, label, isCurrent }) => {
  if (isCurrent) {
    return <span className="text-sm font-medium text-primary-text-dark">{label}</span>;
  }
  return (
    <Link href={href || '#'} legacyBehavior>
      <a className="text-sm text-secondary-text-medium hover:text-primary-accent">
        {label}
      </a>
    </Link>
  );
};

export function ScreenHeader({
  title,
  breadcrumbs, // Array of objects: [{ href: '/path', label: 'Page' }, { label: 'Current' }]
  actions,     // ReactNode (e.g., a Button or a group of Buttons)
  showBackButton = false, // For mobile, to show a back button
  onBack, // Optional custom back handler
}) {
  // const { isMobile } = useResponsiveBreakpoints(); // Use if layout changes significantly based on breakpoint within the header

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="bg-card-modal-background border-b border-disabled-text-border-light px-4 sm:px-6 lg:px-8 py-3">
      <div className="flex items-center justify-between min-h-[2.5rem]"> {/* min-h-10 for 40px */} 
        {/* Left section: Back button or Breadcrumbs/Title */} 
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={handleBack} className="md:hidden mr-1"> {/* Show only on mobile/tablet conceptually */} 
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          )}
          
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1.5">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.label + index}>
                  <BreadcrumbItem href={crumb.href} label={crumb.label} isCurrent={index === breadcrumbs.length - 1} />
                  {index < breadcrumbs.length - 1 && <span className="text-secondary-text-medium">/</span>}
                </React.Fragment>
              ))}
            </nav>
          )}

          {/* Title is primary on mobile if no back button, or if breadcrumbs are hidden */} 
          {/* On desktop, title might be less prominent if breadcrumbs exist, or part of it */} 
          <h1 className={cn(
            "text-lg font-semibold text-primary-text-dark",
            breadcrumbs && breadcrumbs.length > 0 && "md:hidden" // Hide on desktop if breadcrumbs are shown
          )}>
            {title}
          </h1>
        </div>

        {/* Right section: Actions */} 
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
} 