import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setMessageSent(false);
    try {
      const response = await authService.forgotPassword(data.email);
      if (response.success) {
        toast.success(response.message);
        setMessageSent(true); // To show a confirmation message on the page
      } else {
        toast.error(response.message || 'Failed to send reset link. Please try again.');
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error('An unexpected error occurred. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-beige p-4">
      <Card className="w-full max-w-md shadow-duotrak-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary-accent">Forgot Your Password?</CardTitle>
          <CardDescription>Enter your email address and we'll send you a link to reset your password.</CardDescription>
        </CardHeader>
        <CardContent>
          {messageSent ? (
            <div className="text-center p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
              <p>If an account with that email exists, a password reset link has been sent. Please check your inbox (and spam folder).</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={errors.email ? "border-error-red focus-visible:ring-error-red" : ""}
                />
                {errors.email && <p className="text-sm text-error-red mt-1">{errors.email.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending Link...' : 'Send Password Reset Link'}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm">
          <p className="text-secondary-text-medium">
            Remember your password?{' '}
            <Link href="/auth/login" legacyBehavior>
              <a className="font-medium text-primary-accent hover:underline">Login here</a>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 