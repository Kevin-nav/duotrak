import React from 'react';
import { motion } from 'framer-motion';
import { Inbox, Search, FileText, BellOff, BarChart2, Target, ListPlus } from 'lucide-react'; // Common default icons
import { cn } from '@/lib/utils';

const defaultIcons = {
  inbox: Inbox,
  search: Search,
  file: FileText,
  notifications: BellOff,
  chart: BarChart2,
  goal: Target,
  system: ListPlus,
};

export const EmptyState = ({
  iconType, // 'inbox', 'search', or a ReactNode for custom icon
  title = "No items to display",
  message = "There's nothing here yet. Try adjusting your filters or adding new items.",
  ctaButton,
  className,
}) => {
  const IconComponent =
    typeof iconType === 'string' ? defaultIcons[iconType] : iconType;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center justify-center text-center p-6 py-8 md:p-8 md:py-12 gap-4 md:gap-6 bg-card-modal-background rounded-lg shadow-duotrak-card",
        className
      )}
    >
      {IconComponent && (
        <IconComponent className="w-12 h-12 md:w-16 md:h-16 text-secondary-text-medium opacity-75" strokeWidth={1.5} />
      )}
      <h3 className="text-lg md:text-xl font-semibold text-primary-text-dark mt-2">
        {title}
      </h3>
      <p className="text-sm md:text-base text-secondary-text-medium max-w-md">
        {message}
      </p>
      {ctaButton && <div className="mt-3 md:mt-4">{ctaButton}</div>}
    </motion.div>
  );
}; 