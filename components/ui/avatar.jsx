import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import Image from 'next/image';

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)}
      {...props} />
  );
}

function AvatarImage({
  className,
  alt,
  src,
  ...props
}) {
  return (
    <AvatarPrimitive.Image
      asChild
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    >
      <Image 
        src={src || ''}
        alt={alt || ''}
        className={cn("aspect-square size-full object-cover", className)}
        layout="fill"
      />
    </AvatarPrimitive.Image>
  );
}

function AvatarFallback({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props} />
  );
}

export { Avatar, AvatarImage, AvatarFallback }
