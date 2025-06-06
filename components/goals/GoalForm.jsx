import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const goalCategories = ["Fitness", "Career", "Personal Development", "Finance", "Health & Wellness", "Hobbies", "Relationships", "Other"];
const goalStatuses = ["Not Started", "In Progress", "On Hold", "Achieved", "Abandoned"];
const goalPriorities = ["Low", "Medium", "High"];

export const GoalForm = ({ onSubmit, initialData = null, isLoading = false, formType = "create" }) => {
  const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      category: goalCategories[0],
      startDate: new Date().toISOString().split('T')[0],
      targetDate: '',
      status: goalStatuses[0],
      priority: goalPriorities[1],
      aiAssistedPlan: '' // This field might be read-only or AI-populated elsewhere
    }
  });

  useEffect(() => {
    if (initialData) {
      // Ensure dates are in 'yyyy-MM-dd' format for date inputs
      const formattedData = {
        ...initialData,
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        targetDate: initialData.targetDate ? new Date(initialData.targetDate).toISOString().split('T')[0] : '',
      };
      reset(formattedData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Card className="shadow-duotrak-card max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-primary-text-dark">
          {formType === 'create' ? 'Create New Goal' : 'Edit Goal'}
        </CardTitle>
        <CardDescription>
          {formType === 'create' ? 'Define your new objective and how you plan to achieve it.' : 'Update the details of your existing goal.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title" className={cn(errors.title && "text-error-red")}>Title</Label>
            <Input
              id="title"
              {...register("title", { required: "Goal title is required." })}
              className={cn(errors.title && "border-error-red focus-visible:ring-error-red")}
              placeholder="e.g., Run a 5K Race"
              aria-invalid={errors.title ? "true" : "false"}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {errors.title && <p id="title-error" className="text-sm text-error-red mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className={cn(errors.description && "text-error-red")}>Description</Label>
            <Textarea
              id="description"
              {...register("description", { required: "A brief description is required." })}
              className={cn(errors.description && "border-error-red focus-visible:ring-error-red", "min-h-[100px]")}
              placeholder="e.g., Train and participate in a local 5K race by the end of the quarter."
              aria-invalid={errors.description ? "true" : "false"}
              aria-describedby={errors.description ? "description-error" : undefined}
            />
            {errors.description && <p id="description-error" className="text-sm text-error-red mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <Label htmlFor="category">Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="category" aria-label="Goal category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {goalCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Priority */}
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="priority" aria-label="Goal priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {goalPriorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div>
              <Label htmlFor="startDate" className={cn(errors.startDate && "text-error-red")}>Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate", { 
                    required: "Start date is required.",
                    validate: value => {
                        const targetDate = watch('targetDate');
                        return new Date(value) <= (targetDate ? new Date(targetDate) : Infinity) || "Start date cannot be after target date.";
                    }
                })}
                className={cn(errors.startDate && "border-error-red focus-visible:ring-error-red")}
                aria-invalid={errors.startDate ? "true" : "false"}
                aria-describedby={errors.startDate ? "start-date-error" : undefined}
              />
              {errors.startDate && <p id="start-date-error" className="text-sm text-error-red mt-1">{errors.startDate.message}</p>}
            </div>

            {/* Target Date */}
            <div>
              <Label htmlFor="targetDate" className={cn(errors.targetDate && "text-error-red")}>Target Date</Label>
              <Input
                id="targetDate"
                type="date"
                {...register("targetDate", {
                    validate: value => {
                        const startDate = watch('startDate');
                        return !value || !startDate || new Date(value) >= new Date(startDate) || "Target date cannot be before start date.";
                    }
                })}
                className={cn(errors.targetDate && "border-error-red focus-visible:ring-error-red")}
                aria-invalid={errors.targetDate ? "true" : "false"}
                aria-describedby={errors.targetDate ? "target-date-error" : undefined}
              />
              {errors.targetDate && <p id="target-date-error" className="text-sm text-error-red mt-1">{errors.targetDate.message}</p>}
            </div>
          </div>

          {/* Status (only show if editing) */}
          {formType === 'edit' && (
            <div>
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="status" aria-label="Goal status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {goalStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}
          
          {/* AI Assisted Plan (Read-only example, or could be a feature later) */}
          {initialData?.aiAssistedPlan && (
             <div>
                <Label htmlFor="aiAssistedPlan">AI Assisted Plan (Informational)</Label>
                <Textarea
                    id="aiAssistedPlan"
                    value={initialData.aiAssistedPlan}
                    readOnly
                    className="min-h-[80px] bg-secondary-beige-extralight border-disabled-text-border-light"
                    aria-readonly="true"
                />
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {formType === 'create' ? 'Create Goal' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}; 