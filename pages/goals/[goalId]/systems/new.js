import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { systemService } from '@/services/systemService';
import { goalService } from '@/services/goalService';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NewSystemPage() {
  const router = useRouter();
  const { goalId } = router.query;
  const [goal, setGoal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingGoal, setIsFetchingGoal] = useState(true);

  const { register, handleSubmit, formState: { errors }, control } = useForm({
    defaultValues: {
      verification_required: false,
      metric_type: 'BINARY' // Default as per spec
    }
  });
  
  useEffect(() => {
    if (!goalId) return;
    const fetchGoal = async () => {
      setIsFetchingGoal(true);
      try {
        const res = await goalService.getGoalById(goalId);
        if (res.success) {
          setGoal(res.data);
        } else {
          toast.error("Could not load the parent goal.");
          router.push('/goals');
        }
      } catch (e) {
        toast.error("An error occurred while fetching the goal.");
        router.push('/goals');
      }
      setIsFetchingGoal(false);
    }
    fetchGoal();
  }, [goalId, router]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    toast.info('Creating your new system...');
    try {
      const response = await systemService.createSystemForGoal(goalId, data);
      if (response.success) {
        toast.success('System created successfully!');
        router.push(`/goals/${goalId}`);
      } else {
        throw new Error(response.message || 'Failed to create system.');
      }
    } catch (error) {
      console.error("Create system error:", error);
      toast.error(error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isFetchingGoal || !goal) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary-accent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <ScreenHeader 
        title="Create a New System"
        breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" }, 
            { label: "Goals", href: "/goals" },
            { label: goal.title, href: `/goals/${goalId}` },
            { label: "New System", isCurrent: true }
        ]}
        actions={[
            <Button variant="outline" onClick={() => router.back()} key="back-btn">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Goal
            </Button>
        ]}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-2xl mx-auto mt-6 shadow-duotrak-card">
          <CardHeader>
            <CardTitle>System Details</CardTitle>
            <CardDescription>Define the repeatable action that will drive you towards your goal.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="title" className={cn(errors.title && 'text-destructive')}>Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Practice guitar for 30 minutes"
                  {...register("title", { required: "Title is required" })}
                  className={cn(errors.title && 'border-destructive')}
                />
                {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the process. What exactly needs to be done?"
                  {...register("description", { required: "Description is required" })}
                  rows={3}
                  className={cn(errors.description && 'border-destructive')}
                />
                {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="frequency" className={cn(errors.frequency && 'text-destructive')}>Frequency</Label>
                   <Controller
                    name="frequency"
                    control={control}
                    rules={{ required: "Frequency is required" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className={cn(errors.frequency && 'border-destructive')}>
                          <SelectValue placeholder="How often?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DAILY">Daily</SelectItem>
                          <SelectItem value="WEEKLY">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.frequency && <p className="text-sm text-destructive mt-1">{errors.frequency.message}</p>}
                </div>
                <div>
                  <Label htmlFor="metric_type" className={cn(errors.metric_type && 'text-destructive')}>Metric Type</Label>
                   <Controller
                    name="metric_type"
                    control={control}
                    rules={{ required: "Metric type is required" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className={cn(errors.metric_type && 'border-destructive')}>
                          <SelectValue placeholder="How to measure it?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BINARY">Done / Not Done</SelectItem>
                          <SelectItem value="COUNTER">Counter (e.g., reps)</SelectItem>
                          <SelectItem value="DURATION">Duration (e.g., minutes)</SelectItem>
                           <SelectItem value="PAGES">Pages</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.metric_type && <p className="text-sm text-destructive mt-1">{errors.metric_type.message}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Controller
                  name="verification_required"
                  control={control}
                  render={({ field }) => (
                     <Switch
                        id="verification_required"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                  )}
                />
                <Label htmlFor="verification_required">Require Partner Verification?</Label>
              </div>


              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Saving System...' : 'Create System'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

