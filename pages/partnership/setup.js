import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { partnershipService } from '@/services/partnershipService';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PartnershipSetupPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await partnershipService.setupPartnership({ name: data.partnershipName });
      if (response.success) {
        toast.success(response.message || 'Partnership set up successfully!');
        router.push('/dashboard');
      } else {
        toast.error(response.message || 'Failed to set up partnership.');
      }
    } catch (error) {
      console.error("Partnership setup error:", error);
      toast.error('An unexpected error occurred during setup.');
    }
    setIsSubmitting(false);
  };

  // Basic protection: redirect if not authenticated or still loading auth state
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading user data...</p></div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-beige p-4">
      <Card className="w-full max-w-md shadow-duotrak-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary-accent">Set Up Your Partnership</CardTitle>
          <CardDescription>
            Give your partnership a name to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="partnershipName">Partnership Name</Label>
              <Input
                id="partnershipName"
                type="text"
                placeholder="e.g., Team Awesome, The Power Couple"
                {...register("partnershipName", {
                  required: "Partnership name is required",
                })}
                className={errors.partnershipName ? "border-error-red focus-visible:ring-error-red" : ""}
              />
              {errors.partnershipName && <p className="text-sm text-error-red mt-1">{errors.partnershipName.message}</p>}
            </div>
            {/* Add more fields here if needed, e.g., for shared goals, roles, etc. */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Saving Partnership...' : 'Save & Continue to Dashboard'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 