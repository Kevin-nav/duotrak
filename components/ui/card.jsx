import * as React from "react"
import { motion } from "framer-motion";

import { cn } from "@/lib/utils"

// Framer Motion variants for card entrance animation
const cardVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const Card = React.forwardRef(({ className, children, noAnimation, ...props }, ref) => (
  <motion.div
    ref={ref}
    variants={!noAnimation ? cardVariants : undefined}
    initial={!noAnimation ? "initial" : undefined}
    animate={!noAnimation ? "animate" : undefined}
    whileHover={!noAnimation ? { scale: 1.03, zIndex: 10 } : {}}
    transition={!noAnimation ? { duration: 0.2 } : {}}
    className={cn(
      // DuoTrak specific styles from prd.md Section 7.B - Updated
      "rounded-xl border border-disabled-text-border-light bg-card-modal-background",
      "relative z-1", // Added for stacking context
      // Original Shadcn flex and gap for internal structure, if needed, or can be managed by content.
      // "flex flex-col gap-6", // This might be too restrictive, let content define internal layout.
      // py-6 from original might be too much default padding, let content decide or reduce.
      // "py-6", 
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
));
Card.displayName = "Card";

// CardHeader, CardTitle, CardDescription, CardContent, CardFooter
// remain largely the same as Shadcn defaults unless specific PRD overrides are needed.
// Padding (px-6) and spacing (gap-1.5) are generally good defaults from Shadcn.

// Helper to create Card components with consistent styling and motion props
const createCardComponent = (Component, baseClassName, displayName) => {
  const MotionComponent = motion[Component];
  const CardComponent = React.forwardRef(({ className, ...props }, ref) => (
    <MotionComponent
      ref={ref}
      className={cn(baseClassName, className)}
      {...props}
    />
  ));
  CardComponent.displayName = displayName;
  return CardComponent;
};

const CardHeader = createCardComponent("div", "flex flex-col space-y-1.5 p-6", "CardHeader");

const CardTitle = createCardComponent("h3", "text-lg font-semibold leading-none tracking-tight text-primary-text-dark", "CardTitle");

const CardDescription = createCardComponent("p", "text-sm text-secondary-text-medium", "CardDescription");

// CardAction is not a standard Shadcn card part, removing it to keep it standard
// unless explicitly needed and defined in PRD for a specific card layout.
/*
function CardAction({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props} />
  );
}
*/

const CardContent = createCardComponent("div", "p-6 pt-0", "CardContent");

const CardFooter = createCardComponent("div", "flex items-center p-6 pt-0", "CardFooter");

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  // CardAction, // Removed for now
  CardDescription,
  CardContent,
}
