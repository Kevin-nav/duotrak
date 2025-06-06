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

// Mock data - in a real app, these might come from config or an API
const systemFrequencies = ["Daily", "Weekly", "Bi-Weekly", "Monthly", "Mon, Wed, Fri", "Tue, Thu", "Weekends Only", "Custom"];
const systemCheckInTypes = ["Simple Confirmation", "Notes Required", "Rating (1-5)", "Photo Upload (Conceptual)"];
const systemStatuses = ["Active", "Paused", "Completed"];

export const SystemForm = ({ onSubmit, goalId, initialData = null, isLoading = false, formType = "create" }) => {
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      frequency: systemFrequencies[0],
      checkInType: systemCheckInTypes[0],
      status: systemStatuses[0],
      goalId: goalId, // Pre-fill goalId
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({...initialData, goalId: initialData.goalId || goalId });
    } else {
      reset({ 
        title: '', 
        description: '', 
        frequency: systemFrequencies[0], 
        checkInType: systemCheckInTypes[0], 
        status: systemStatuses[0], 
        goalId 
      });
    }
  }, [initialData, reset, goalId]);

  const handleFormSubmit = (data) => {
    onSubmit(data); // goalId is already part of the form data
  };

  return (
    <Card className="shadow-duotrak-card max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-primary-text-dark">
          {formType === 'create' ? 'Create New System' : 'Edit System'}
        </CardTitle>
        <CardDescription>
          {formType === 'create' ? 'Define a new system to support your goal.' : 'Update the details of this system.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title" className={cn(errors.title && "text-error-red")}>System Title</Label>
            <Input
              id="title"
              {...register("title", { required: "System title is required." })}
              className={cn(errors.title && "border-error-red focus-visible:ring-error-red")}
              placeholder="e.g., Daily Morning Run"
              aria-invalid={errors.title ? "true" : "false"}
              aria-describedby={errors.title ? "system-title-error" : undefined}
            />
            {errors.title && <p id="system-title-error" className="text-sm text-error-red mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className={cn(errors.description && "text-error-red")}>Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              className={cn(errors.description && "border-error-red focus-visible:ring-error-red", "min-h-[80px]")}
              placeholder="e.g., Run for at least 20 minutes every morning before work."
              aria-invalid={errors.description ? "true" : "false"}
              aria-describedby={errors.description ? "system-description-error" : undefined}
            />
            {errors.description && <p id="system-description-error" className="text-sm text-error-red mt-1">{errors.description.message}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Frequency */}
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Controller
                name="frequency"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="frequency" aria-label="System frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {systemFrequencies.map(freq => <SelectItem key={freq} value={freq}>{freq}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Check-in Type */}
            <div>
              <Label htmlFor="checkInType">Check-in Type</Label>
              <Controller
                name="checkInType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="checkInType" aria-label="System check-in type">
                      <SelectValue placeholder="Select check-in type" />
                    </SelectTrigger>
                    <SelectContent>
                      {systemCheckInTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          
          {/* Status (Always show for systems) */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="status" aria-label="System status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {systemStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

          <input type="hidden" {...register("goalId")} />

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {formType === 'create' ? 'Create System' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}; 