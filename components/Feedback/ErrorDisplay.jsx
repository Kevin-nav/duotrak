import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertTriangle, WifiOff, ServerCrash, Frown } from 'lucide-react'; // Default icons
import { cn } from '@/lib/utils';

const defaultIcons = {
  network: WifiOff,
  server: ServerCrash,
  generic: AlertTriangle,
  notFound: Frown,
};

export const ErrorDisplay = ({
  iconType = 'generic', // 'network', 'server', 'generic', 'notFound' or a ReactNode
  title = "Oops! Something went wrong.",
  message = "An unexpected error occurred. Please try again later.",
  retryFunction,
  className,
}) => {
  const IconComponent =
    typeof iconType === 'string' ? defaultIcons[iconType] || defaultIcons.generic : iconType;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center justify-center text-center p-6 md:p-8 h-full min-h-[300px] gap-4 md:gap-6 bg-card-modal-background rounded-lg shadow-duotrak-card",
        className
      )}
      role="alert"
    >
      {IconComponent && (
        <IconComponent className="w-12 h-12 md:w-16 md:h-16 text-error-red" strokeWidth={1.5} />
      )}
      <h2 className="text-xl md:text-2xl font-semibold text-primary-text-dark">{title}</h2>
      <p className="text-sm md:text-base text-secondary-text-medium max-w-md">
        {message}
      </p>
      {retryFunction && (
        <Button variant="default" onClick={retryFunction} className="mt-2 md:mt-4">
          Retry
        </Button>
      )}
    </motion.div>
  );
}; 