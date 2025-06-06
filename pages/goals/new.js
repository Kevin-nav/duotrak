import React, { useState } from 'react';
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

export default function NewGoalPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, control } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    toast.info('Creating your new goal...');
    try {
      const response = await goalService.createGoal(data);
      if (response.success) {
        toast.success('Goal created successfully!');
        router.push('/goals');
      } else {
        throw new Error(response.message || 'Failed to create goal.');
      }
    } catch (error) {
      console.error("Create goal error:", error);
      toast.error(error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ScreenHeader 
        title="Create a New Goal"
        breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" }, 
            { label: "Goals", href: "/goals" },
            { label: "New", isCurrent: true }
        ]}
        actions={[
            <Button variant="outline" onClick={() => router.back()} key="back-btn">
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
            <CardTitle>Goal Details</CardTitle>
            <CardDescription>Define your new objective. What do you want to achieve?</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="title" className={cn(errors.title && 'text-destructive')}>Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Learn to Play the Guitar"
                  {...register("title", { required: "Title is required" })}
                  className={cn(errors.title && 'border-destructive')}
                />
                {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your goal. Why is it important to you? What does success look like?"
                  {...register("description")}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Personal Growth, Fitness"
                    {...register("category")}
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                   <Controller
                    name="priority"
                    control={control}
                    defaultValue="Medium"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Saving Goal...' : 'Create Goal'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 