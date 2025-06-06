import * as React from "react"
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"

// Framer Motion variants for input error shake (reused from Input)
const textAreaErrorShakeVariants = {
  shake: {
    x: [0, -5, 5, -5, 5, 0],
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  initial: {
    x: 0,
  }
};

const Textarea = React.forwardRef(({ className, "aria-invalid": ariaInvalid, ...props }, ref) => {
  return (
    <motion.textarea
      ref={ref}
      variants={textAreaErrorShakeVariants}
      animate={ariaInvalid ? "shake" : "initial"}
      className={cn(
        // Base styles from PRD Section 7.D - Updated
        "flex min-h-[80px] w-full rounded-md border bg-card-modal-background px-3 py-2.5 text-sm", // Adjusted padding, bg
        "text-primary-text-dark placeholder:text-secondary-text-medium",
        "border-disabled-text-border-light", // Changed from border-input
        // Focus state from PRD - Updated
        "focus-visible:outline-none focus-visible:border-primary-accent focus-visible:ring-2 focus-visible:ring-primary-accent/30 focus-visible:ring-offset-0", // Ring offset to 0, added /30 opacity
        // Error state from PRD
        "aria-invalid:border-error-red aria-invalid:ring-1 aria-invalid:ring-error-red/50",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-secondary-beige-light/50 disabled:border-disabled-text-border-light", // Added disabled bg and border
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea"

export { Textarea }
