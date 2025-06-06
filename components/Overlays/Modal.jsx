import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
  DialogOverlay,
  DialogPortal
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const DuoTrakModal = ({
  isOpen,
  onOpenChange,
  triggerElement,
  title,
  description,
  children,
  footerContent,
  hideCloseButton = false,
  size = 'md',
  className,
}) => {
  const modalSizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const modalContent = (
    <DialogPortal>
      <DialogOverlay />
      <DialogContent
        className={cn(modalSizes[size], className)}
      >
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        <div className="py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        {footerContent && (
          <DialogFooter>
            {footerContent}
          </DialogFooter>
        )}
        {!hideCloseButton && (
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Close"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </DialogClose>
        )}
      </DialogContent>
    </DialogPortal>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {triggerElement && <DialogTrigger asChild>{triggerElement}</DialogTrigger>}
      <AnimatePresence>
        {isOpen && modalContent}
      </AnimatePresence>
    </Dialog>
  );
};

export default DuoTrakModal; 