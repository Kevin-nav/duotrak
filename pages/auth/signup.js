import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // Watch password field for confirm password validation
  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authService.signup({ email: data.email, password: data.password });
      if (response.success) {
        toast.success(response.message || 'Signup successful! Please login.');
        if (router.query.redirect) {
          router.push(router.query.redirect);
        } else {
          router.push('/auth/login');
        }
      } else {
        toast.error(response.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error('An unexpected error occurred. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-beige p-4">
      <Card className="w-full max-w-md shadow-duotrak-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary-accent">Create your DuoTrak Account</CardTitle>
          <CardDescription>Join your partner in achieving your goals together.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email" className={cn(errors.email && "text-error-red")}>Email</Label>
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
                className={cn(errors.email && "border-error-red focus-visible:ring-error-red")}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "signup-email-error" : undefined}
              />
              {errors.email && <p id="signup-email-error" className="text-sm text-error-red mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password" className={cn(errors.password && "text-error-red")}>Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    // Add more complex regex for strength if needed e.g. /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/ 
                  })}
                  className={cn("pr-10", errors.password && "border-error-red focus-visible:ring-error-red")}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "signup-password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-secondary-text-medium hover:text-primary-accent"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p id="signup-password-error" className="text-sm text-error-red mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <Label htmlFor="confirmPassword" className={cn(errors.confirmPassword && "text-error-red")}>Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className={cn("pr-10", errors.confirmPassword && "border-error-red focus-visible:ring-error-red")}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  aria-describedby={errors.confirmPassword ? "signup-confirmPassword-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-secondary-text-medium hover:text-primary-accent"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p id="signup-confirmPassword-error" className="text-sm text-error-red mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm">
          <p className="text-secondary-text-medium">
            Already have an account?{' '}
            <Link href="/auth/login" legacyBehavior>
              <a className="font-medium text-primary-accent hover:underline">Login here</a>
            </Link>
          </p>
          <div className="mt-4 text-center text-xs text-secondary-text-light">
            <Link href="/contact" legacyBehavior><a className="hover:underline">Contact Us</a></Link>
            <span className="mx-2">|</span>
            <Link href="/terms" legacyBehavior><a className="hover:underline">Terms of Service</a></Link>
            <span className="mx-2">|</span>
            <Link href="/privacy" legacyBehavior><a className="hover:underline">Privacy Policy</a></Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 