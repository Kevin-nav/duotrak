import Link from 'next/link';
import { useRouter } from 'next/router'; // Or from 'next/navigation' for App Router
import { cn } from '@/lib/utils';

export function TopNavLink({ href, children }) {
  const router = useRouter();
  const isActive = router.pathname === href || (href !== "/" && router.pathname.startsWith(href));

  return (
    <Link href={href} legacyBehavior>
      <a
        className={cn(
          "px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150",
          isActive
            ? "text-primary-accent font-semibold"
            : "text-primary-text-dark hover:text-primary-accent hover:bg-secondary-beige-light"
        )}
      >
        {children}
      </a>
    </Link>
  );
} 