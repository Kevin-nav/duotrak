import React, { useEffect, useState } from 'react';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  Loader2,
  TrendingUp
} from 'lucide-react';
import { goalService } from '@/services/goalService';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { ErrorDisplay } from '@/components/Feedback/ErrorDisplay';
import { EmptyState } from '@/components/Feedback/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut"} },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } },
};

export default function GoalListPage() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchGoals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await goalService.getGoals();
      if (response.success) {
        setGoals(response.data.items);
      } else {
        throw new Error(response.message || "Failed to fetch goals.");
      }
    } catch (err) {
      console.error("Fetch goals error:", err);
      setError(err.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleDeleteGoal = async () => {
    if (!goalToDelete) return;
    setIsDeleting(true);
    try {
      const response = await goalService.deleteGoal(goalToDelete.id);
      if (response.success) {
        toast.success(`Goal "${goalToDelete.title}" deleted successfully.`);
        setGoals(prevGoals => prevGoals.filter(g => g.id !== goalToDelete.id));
        setGoalToDelete(null);
      } else {
        throw new Error(response.message || "Failed to delete goal.");
      }
    } catch (err) {
      console.error("Delete goal error:", err);
      toast.error(err.message || `Could not delete goal "${goalToDelete.title}".`);
    }
    setIsDeleting(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Achieved': 
        return { bgColor: 'bg-success-green', textColor: 'text-primary-text-dark' }; // Dark text on green
      case 'In Progress': 
        return { bgColor: 'bg-notification-amber', textColor: 'text-primary-text-dark' }; // Dark text on amber/yellow
      case 'On Hold': 
        return { bgColor: 'bg-warning-orange', textColor: 'text-primary-text-dark' }; // Dark text on orange
      case 'Abandoned': 
        return { bgColor: 'bg-error-red', textColor: 'text-white' }; // White text on red is usually fine
      case 'Not Started': 
      default: 
        return { bgColor: 'bg-gray-400', textColor: 'text-primary-text-dark' }; // Dark text on gray
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-error-red';
      case 'Medium': return 'text-warning-orange';
      case 'Low': return 'text-info-blue';
      default: return 'text-gray-500';
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
            title="Could Not Load Goals"
            message={error}
            retryFunction={fetchGoals}
            iconType="server"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <ScreenHeader 
        title="Your Goals"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Goals", isCurrent: true }]}
        actions={[
            <Link href="/goals/new" key="new-goal">
                <Button variant="default">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Goal
                </Button>
            </Link>
        ]}
      />

      {!isLoading && !error && goals.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mt-10"
        >
            <EmptyState 
                title="No Goals Yet!"
                message="It looks like you haven\'t set any goals. Start by creating one to track your progress."
                iconType="goal"
                ctaButton={
                    <Link href="/goals/new" passHref>
                        <Button variant="default" size="lg">
                            <PlusCircle className="h-5 w-5 mr-2" />
                            Create Your First Goal
                        </Button>
                    </Link>
                }
            />
        </motion.div>
      )}

      {goals.length > 0 && (
        <AnimatePresence>
          <motion.div 
            className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {goals.map(goal => (
              <AlertDialog key={`alert-${goal.id}`}>
                <Card 
                  key={goal.id} 
                  className="flex flex-col shadow-duotrak-card hover:shadow-lg transition-shadow"
                  layout
                  variants={itemVariants}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-1">
                      <CardTitle className="text-lg text-primary-text-dark leading-tight">{goal.title}</CardTitle>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap", 
                        getStatusColor(goal.status).bgColor, 
                        getStatusColor(goal.status).textColor
                      )}>
                        {goal.status}
                      </span>
                    </div>
                    {goal.category && <CardDescription className="text-xs">Category: {goal.category}</CardDescription>}
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-secondary-text-medium mb-3 line-clamp-3" title={goal.description}>{goal.description}</p>
                    
                    <Link href={`/progress?goalId=${goal.id}`} passHref legacyBehavior>
                      <a className="block mb-3 group hover:bg-primary-beige-extralight p-2 -mx-2 rounded-md transition-colors duration-150">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-secondary-text-dark group-hover:text-primary-accent">Goal Progress</span>
                          <span className="text-xs font-semibold text-primary-text-dark group-hover:text-primary-accent">{goal.progressValue}%</span>
                        </div>
                        <Progress value={goal.progressValue} className="h-2 group-hover:[&>div]:bg-primary-accent" />
                        <div className="text-xs text-right text-secondary-text-medium mt-1 group-hover:text-primary-accent flex items-center justify-end">
                          View Detailed Progress <TrendingUp className="h-3 w-3 ml-1" />
                        </div>
                      </a>
                    </Link>

                    <div className="text-xs text-secondary-text-dark space-y-1 border-t pt-3 mt-3">
                      <p>Priority: <span className={cn("font-semibold", getPriorityColor(goal.priority))}>{goal.priority}</span></p>
                      {goal.targetDate && <p>Target: {new Date(goal.targetDate).toLocaleDateString()}</p>}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 border-t pt-3">
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => setGoalToDelete(goal)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <Link href={`/goals/${goal.id}/edit`} passHref>
                      <Button variant="ghost" size="icon" className="text-primary-accent hover:bg-primary-accent/10">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/goals/${goal.id}`} passHref>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1.5" /> View
                      </Button>
                    </Link>
                  </CardFooter>
                  {goalToDelete && goalToDelete.id === goal.id && (
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the goal
                          <strong className="px-1">"{goalToDelete?.title}"</strong>. 
                          Associated systems will eventually be unlinked or handled according to future logic (not deleted by this action).
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting} onClick={() => setGoalToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeleteGoal} 
                          disabled={isDeleting}
                          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        >
                          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  )}
                </Card>
              </AlertDialog>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
} 