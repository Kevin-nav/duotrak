import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { goalService } from '@/services/goalService';
import { systemService } from '@/services/systemService';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Loader2, PlusCircle, Eye, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ErrorDisplay } from '@/components/Feedback/ErrorDisplay';
import { EmptyState } from '@/components/Feedback/EmptyState';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from 'next/link';

const GoalDetailPage = () => {
  const router = useRouter();
  const { goalId } = router.query;

  const [goal, setGoal] = useState(null);
  const [systems, setSystems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!goalId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const goalResponse = await goalService.getGoalById(goalId);
        if (!goalResponse.success) {
          throw new Error(goalResponse.message || 'Failed to fetch goal data.');
        }
        setGoal(goalResponse.data);

        const systemsResponse = await systemService.getSystemsForGoal(goalId);
        if (!systemsResponse.success) {
            throw new Error(systemsResponse.message || 'Failed to fetch systems for this goal.');
        }
        setSystems(systemsResponse.data.items);

      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [goalId]);

  // Placeholder for delete functionality
  const handleDeleteSystem = async (systemId) => {
    toast.info(`Delete functionality for system ${systemId} is not implemented yet.`);
  };


  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[calc(100vh-128px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary-accent" />
      </div>
    );
  }

  if (error && !goal) { // Show full-page error only if goal couldn't load
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
        title={goal?.title || "Goal Details"}
        breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" }, 
            { label: "Goals", href: "/goals" },
            { label: goal?.title || 'Details', isCurrent: true }
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
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="my-6 shadow-duotrak-card">
            <CardHeader>
                <CardTitle>{goal.title}</CardTitle>
                <CardDescription>{goal.description || "No description provided."}</CardDescription>
            </CardHeader>
            <CardContent>
                {/* More goal details can go here */}
                <div className="text-sm text-secondary-text-medium">
                    <p>Priority: <span className="font-semibold">{goal.priority}</span></p>
                    <p>Status: <span className="font-semibold">{goal.status}</span></p>
                    {goal.targetDate && <p>Target Date: {new Date(goal.targetDate).toLocaleDateString()}</p>}
                </div>
            </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-primary-text-dark">Systems for this Goal</h2>
            {/* This button will be implemented in a future subtask */}
            <Link href={`/goals/${goalId}/systems/new`} passHref>
              <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New System
              </Button>
            </Link>
        </div>

        {error && <ErrorDisplay title="Could not load systems" message={error} retryFunction={() => window.location.reload()} />}

        {!error && systems.length === 0 && (
             <EmptyState 
                title="No Systems Defined"
                message="This goal doesn't have any systems yet. Create one to start building a routine."
                iconType="system"
                ctaButton={
                  <Link href={`/goals/${goalId}/systems/new`} passHref>
                    <Button>
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Create Your First System
                    </Button>
                  </Link>
                }
            />
        )}

        {systems.length > 0 && (
            <div className="space-y-4">
                {systems.map(system => (
                     <AlertDialog key={`alert-${system.id}`}>
                        <Card key={system.id} className="shadow-duotrak-card hover:shadow-lg transition-shadow flex items-center p-4">
                            <div className="flex-grow">
                                <CardTitle className="text-lg">{system.title}</CardTitle>
                                <CardDescription className="mt-1">{system.description}</CardDescription>
                                <div className="text-xs text-secondary-text-medium mt-2">
                                    <span>Frequency: {system.frequency}</span> | <span>Metric: {system.metric_type}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                               <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => {/* setSystemToDelete(system) */}}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <Link href={`/systems/${system.id}/edit`} passHref>
                                  <Button variant="ghost" size="icon" className="text-primary-accent hover:bg-primary-accent/10">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </Link>
                            </div>
                        </Card>
                    </AlertDialog>
                ))}
            </div>
        )}
       </motion.div>
    </div>
  );
};

export default GoalDetailPage;