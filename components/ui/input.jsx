import * as React from "react"
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"

// Framer Motion variants for input error shake
const inputErrorShakeVariants = {
  shake: {
    x: [0, -5, 5, -5, 5, 0],
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  initial: {
    x: 0,
  }
};

const Input = React.forwardRef(({ className, type, "aria-invalid": ariaInvalid, ...props }, ref) => {
  return (
    <motion.input
      type={type}
      ref={ref}
      variants={inputErrorShakeVariants}
      animate={ariaInvalid ? "shake" : "initial"}
      className={cn(
        "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm",
        "text-primary-text-dark placeholder:text-secondary-text-medium",
        "border-input",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent focus-visible:ring-offset-1 focus-visible:border-primary-accent",
        "aria-invalid:border-error-red aria-invalid:ring-1 aria-invalid:ring-error-red/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      {...props} 
    />
  );
});
Input.displayName = "Input"

export { Input }
