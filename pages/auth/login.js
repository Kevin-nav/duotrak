import React, { useState } from 'react';
import Link from 'next/link';
// No need for useRouter here if useAuth handles redirection
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from "@/lib/utils";

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      // Redirect is handled by the login function in AuthContext
      toast.success('Login successful! Redirecting...'); 
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-beige p-4">
      <Card className="w-full max-w-md shadow-duotrak-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary-accent">Welcome Back to DuoTrak</CardTitle>
          <CardDescription>Log in to continue your journey with your partner.</CardDescription>
        </CardHeader>
        <CardContent>
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
                className={cn(errors.email && "border-error-red focus-visible:ring-error-red")}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "login-email-error" : undefined}
              />
              {errors.email && <p id="login-email-error" className="text-sm text-error-red mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password" className={cn(errors.password && "text-error-red")}>Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", { required: "Password is required" })}
                  className={cn("pr-10", errors.password && "border-error-red focus-visible:ring-error-red")}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "login-password-error" : undefined}
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
              {errors.password && <p id="login-password-error" className="text-sm text-error-red mt-1">{errors.password.message}</p>}
            </div>
            <div className="flex items-center justify-end">
                <Link href="/auth/forgot-password" legacyBehavior>
                    <a className="text-sm font-medium text-primary-accent hover:underline">
                        Forgot password?
                    </a>
                </Link>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging In...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm">
          <p className="text-secondary-text-medium">
            Don't have an account?{' '}
            <Link href="/auth/signup" legacyBehavior>
              <a className="font-medium text-primary-accent hover:underline">Sign up here</a>
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