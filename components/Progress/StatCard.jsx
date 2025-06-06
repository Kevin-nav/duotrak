import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton'; // Assuming Skeleton component exists
import { cn } from '@/lib/utils';

// Wrap StatCard with React.memo
export const StatCard = React.memo(({
  title,
  value,
  unit = '',
  description,
  isLoading = false,
  icon: IconComponent, // Optional icon component
  cardClassName,
  titleClassName,
  valueClassName,
  descriptionClassName
}) => {
  // console.log(`Rendering StatCard: ${title}`); // For debugging re-renders
  return (
    <Card className={cn('duotrak-card', cardClassName)}>
      <CardHeader className="pb-sm">
        <CardTitle className={cn('text-lg font-medium text-secondary-text-medium', titleClassName)}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-10 w-3/4 mb-1" />
        ) : (
          <div className="flex items-baseline gap-xs mb-xs">
            <p className={cn('text-4xl font-bold text-primary-accent', valueClassName)}>
              {value}
            </p>
            {unit && <span className="text-xl font-semibold text-primary-accent">{unit}</span>}
          </div>
        )}
        {isLoading ? (
          <Skeleton className="h-4 w-1/2" />
        ) : (
          description && (
            <p className={cn('text-xs text-secondary-text-light', descriptionClassName)}>
              {description}
            </p>
          )
        )}
        {IconComponent && !isLoading && (
          <div className="absolute top-4 right-4">
            <IconComponent className="h-6 w-6 text-primary-accent opacity-70" />
          </div>
        )}
      </CardContent>
    </Card>
  );
});

// Add display name for better debugging
StatCard.displayName = 'StatCard'; 