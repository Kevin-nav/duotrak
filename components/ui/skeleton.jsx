import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "animate-shimmer",
        "bg-[linear-gradient(90deg,theme(colors.muted/0.8)_0%,theme(colors.muted/0.4)_50%,theme(colors.muted/0.8)_100%)]",
        "bg-[length:200%_100%]",
        "rounded-md",
        className
      )}
      {...props} />
  );
}

export { Skeleton }
