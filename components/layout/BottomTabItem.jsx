import Link from 'next/link';
import { useRouter } from 'next/router'; // Or from 'next/navigation' for App Router
import { cn } from '@/lib/utils';

// Example Icon (to be replaced by actual icon prop)
// import { Home } from 'lucide-react'; 

export function BottomTabItem({ href, label, IconComponent }) {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link href={href} legacyBehavior>
      <a
        className={cn(
          "flex flex-col items-center justify-center flex-1 px-2 py-1.5 text-xs transition-colors duration-150",
          isActive ? "text-primary-accent" : "text-secondary-text-medium hover:text-primary-text-dark"
        )}
      >
        {IconComponent && <IconComponent className="h-5 w-5 mb-0.5" />}
        <span>{label}</span>
      </a>
    </Link>
  );
} 