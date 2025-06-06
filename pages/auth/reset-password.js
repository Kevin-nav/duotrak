import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null); // For token validation error

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const newPassword = watch("newPassword");

  useEffect(() => {
    if (router.isReady) {
      const { token: queryToken } = router.query;
      if (queryToken) {
        setToken(queryToken);
        setError(null);
      } else {
        setError("Password reset token is missing or invalid. Please request a new reset link.");
        toast.error("Invalid or missing password reset token.");
      }
    }
  }, [router.isReady, router.query]);

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Password reset token is not available.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await authService.resetPassword(token, data.newPassword);
      if (response.success) {
        toast.success(response.message || 'Password reset successful! You can now login.');
        router.push('/auth/login');
      } else {
        toast.error(response.message || 'Password reset failed. Please try again.');
      }
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error(err.message || 'An unexpected error occurred. Please try again.');
    }
    setIsLoading(false);
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary-beige p-4">
        <Card className="w-full max-w-md shadow-duotrak-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-error-red">Reset Password Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-error-red">{error}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/auth/forgot-password" legacyBehavior>
              <a className="font-medium text-primary-accent hover:underline">
                Request a new password reset link
              </a>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!token && !router.isReady) { // Still waiting for router to be ready to check token
      return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>; 
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-beige p-4">
      <Card className="w-full max-w-md shadow-duotrak-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary-accent">Reset Your Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className={errors.newPassword ? "border-error-red focus-visible:ring-error-red" : ""}
              />
              {errors.newPassword && <p className="text-sm text-error-red mt-1">{errors.newPassword.message}</p>}
            </div>
            <div>
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmNewPassword", {
                  required: "Please confirm your new password",
                  validate: (value) =>
                    value === newPassword || "Passwords do not match",
                })}
                className={errors.confirmNewPassword ? "border-error-red focus-visible:ring-error-red" : ""}
              />
              {errors.confirmNewPassword && <p className="text-sm text-error-red mt-1">{errors.confirmNewPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !token}>
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
            <Link href="/auth/login" legacyBehavior>
              <a className="font-medium text-primary-accent hover:underline">Back to Login</a>
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 