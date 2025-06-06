import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TopNavLink } from './TopNavLink';
import NotificationBell from './NotificationBell';
import { UserProfileMenu } from './UserProfileMenu';

export function TopNavBar() {
  // Placeholder for navigation links - this would typically come from a config
  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/goals", label: "Goals" },
    { href: "/partnership", label: "Partnership" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-16 border-b border-disabled-text-border-light bg-navbar-background shadow-md",
        "flex items-center justify-between px-4 sm:px-6 lg:px-8"
      )}
    >
      <div className="flex items-center space-x-4">
        <Link href="/dashboard" legacyBehavior>
          <a className="text-xl font-bold text-primary-accent">
            DuoTrak
          </a>
        </Link>
        <nav className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => (
            <TopNavLink key={link.href} href={link.href}>
              {link.label}
            </TopNavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-3">
        <NotificationBell notificationCount={3} /> { /* Example count */}
        <UserProfileMenu />
      </div>
    </header>
  );
} 