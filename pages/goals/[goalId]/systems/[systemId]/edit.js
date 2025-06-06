import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { SystemForm } from '@/components/systems/SystemForm';
import { systemService } from '@/services/systemService';
import { goalService } from '@/services/goalService';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function EditSystemPage() {
  const router = useRouter();
  const { goalId, systemId } = router.query;
  const { isAuthenticated, isLoading: authIsLoading } = useAuth();

  const [system, setSystem] = useState(null);
  const [goalTitle, setGoalTitle] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authIsLoading && !isAuthenticated) {
      router.push(`/auth/login?redirect=/goals/${goalId}/systems/${systemId}/edit`);
    }
  }, [isAuthenticated, authIsLoading, router, goalId, systemId]);

  useEffect(() => {
    if (goalId && systemId && isAuthenticated) {
      setIsLoadingData(true);
      setError(null);
      Promise.all([
        systemService.getSystemById(systemId),
        goalService.getGoalById(goalId)
      ]).then(([systemResponse, goalResponse]) => {
        if (systemResponse.success && systemResponse.system) {
          setSystem(systemResponse.system);
        } else {
          throw new Error(systemResponse.message || 'System not found.');
        }
        if (goalResponse.success && goalResponse.goal) {
          setGoalTitle(goalResponse.goal.title);
        } else {
          toast.warn("Could not load parent goal title for breadcrumbs.");
          setGoalTitle(`Goal ${goalId}`);
        }
      }).catch(err => {
        console.error("Fetch system/goal for edit error:", err);
        setError(err.message);
        toast.error(err.message || 'Could not load data for editing.');
        router.push(`/goals/${goalId}`);
      }).finally(() => {
        setIsLoadingData(false);
      });
    }
  }, [goalId, systemId, isAuthenticated, router]);

  const handleUpdateSystem = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await systemService.updateSystem(systemId, data);
      if (response.success && response.system) {
        toast.success(response.message || 'System updated successfully!');
        router.push(`/goals/${goalId}`);
      } else {
        toast.error(response.message || 'Failed to update system.');
      }
    } catch (error) {
      console.error("Update system error:", error);
      toast.error('An unexpected error occurred while updating the system.');
    }
    setIsSubmitting(false);
  };

  if (authIsLoading || !isAuthenticated || isLoadingData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary-accent mb-4" />
        <p>Loading system details for editing...</p>
      </div>
    );
  }

  if (error && !system) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <p className="text-xl text-error-red mb-4">Error loading system: {error}</p>
        </div>
    );
  }
  
  if (!system) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <p className="text-xl text-secondary-text-medium mb-4">System not found.</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <ScreenHeader 
        title={`Edit System: ${system?.title || 'Loading...'}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" }, 
          { label: "Goals", href: "/goals" },
          { label: goalTitle || `Goal ${goalId}`, href: `/goals/${goalId}` },
          { label: "Edit System", isCurrent: true }
        ]}
        showBackButton
        onBack={() => router.push(`/goals/${goalId}`)}
      />
      <div className="mt-6">
        <SystemForm 
          onSubmit={handleUpdateSystem} 
          initialData={system} 
          goalId={goalId}
          isLoading={isSubmitting} 
          formType="edit"
        />
      </div>
    </div>
  );
} 