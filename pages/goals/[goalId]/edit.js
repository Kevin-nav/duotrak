import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { goalService } from '@/services/goalService';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ErrorDisplay } from '@/components/Feedback/ErrorDisplay';

export default function EditGoalPage() {
  const router = useRouter();
  const { goalId } = router.query;
  const [goal, setGoal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors }, control, reset } = useForm();

  useEffect(() => {
    if (!goalId) return;

    const fetchGoal = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await goalService.getGoalById(goalId);
        if (response.success) {
          setGoal(response.data);
          reset(response.data); // Pre-populate the form
        } else {
          throw new Error(response.message || 'Failed to fetch goal data.');
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoal();
  }, [goalId, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    toast.info('Updating your goal...');
    try {
      const response = await goalService.updateGoal(goalId, data);
      if (response.success) {
        toast.success('Goal updated successfully!');
        router.push('/goals');
      } else {
        throw new Error(response.message || 'Failed to update goal.');
      }
    } catch (err) {
      console.error("Update goal error:", err);
      toast.error(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[calc(100vh-128px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary-accent" />
      </div>
    );
  }

  if (error) {
     return (
      <div className="container mx-auto p-4 flex flex-col justify-center items-center min-h-[calc(100vh-128px)] pt-10">
         <ErrorDisplay 
            title="Could Not Load Goal"
            message={error}
            retryFunction={() => router.reload()}
            iconType="server"
        />
      </div>
    );
  }


  return (
    <div className="container mx-auto p-4">
      <ScreenHeader 
        title="Edit Goal"
        breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" }, 
            { label: "Goals", href: "/goals" },
            { label: goal?.title || 'Edit', isCurrent: true }
        ]}
        actions={[
            <Button variant="outline" onClick={() => router.push('/goals')} key="back-btn">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Goals
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
            <CardTitle>Update Goal Details</CardTitle>
            <CardDescription>Refine your objective and keep your aim true.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="title" className={cn(errors.title && 'text-destructive')}>Title</Label>
                <Input
                  id="title"
                  {...register("title", { required: "Title is required" })}
                  className={cn(errors.title && 'border-destructive')}
                />
                {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    {...register("category")}
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                   <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register("startDate")}
                  />
                </div>
                <div>
                  <Label htmlFor="targetDate">Target Date</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    {...register("targetDate")}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Saving Changes...' : 'Update Goal'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 