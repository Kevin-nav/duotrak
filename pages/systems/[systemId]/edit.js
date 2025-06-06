import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { systemService } from '@/services/systemService';
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
import { ErrorDisplay } from '@/components/Feedback/ErrorDisplay';

export default function EditSystemPage() {
  const router = useRouter();
  const { systemId } = router.query;
  const [system, setSystem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors }, control, reset } = useForm();

  useEffect(() => {
    if (!systemId) return;

    const fetchSystem = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await systemService.getSystemById(systemId);
        if (response.success) {
          setSystem(response.data);
          reset(response.data); // Pre-populate the form
        } else {
          throw new Error(response.message || 'Failed to fetch system data.');
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
        router.push('/goals'); // Redirect if system not found
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystem();
  }, [systemId, reset, router]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    toast.info('Updating your system...');
    try {
      const response = await systemService.updateSystem(systemId, data);
      if (response.success) {
        toast.success('System updated successfully!');
        // Redirect back to the goal detail page this system belongs to
        router.push(`/goals/${response.data.goal_id}`);
      } else {
        throw new Error(response.message || 'Failed to update system.');
      }
    } catch (err) {
      console.error("Update system error:", err);
      toast.error(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary-accent" />
      </div>
    );
  }

  if (error) {
     return (
      <div className="container mx-auto p-4">
         <ErrorDisplay 
            title="Could Not Load System"
            message={error}
            retryFunction={() => router.push('/goals')}
            buttonText="Back to Goals"
            iconType="server"
        />
      </div>
    );
  }


  return (
    <div className="container mx-auto p-4">
      <ScreenHeader 
        title="Edit System"
        breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" }, 
            { label: "Goals", href: "/goals" },
            // Potentially add Goal breadcrumb if we fetch it
            { label: system?.title || 'Edit', isCurrent: true }
        ]}
        actions={[
            <Button variant="outline" onClick={() => router.back()} key="back-btn">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
            </Button>
        ]}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="max-w-2xl mx-auto mt-6 shadow-duotrak-card">
          <CardHeader>
            <CardTitle>Update System Details</CardTitle>
            <CardDescription>Refine this repeatable action to keep your progress on track.</CardDescription>
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Saving Changes...' : 'Update System'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
