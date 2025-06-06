import React, { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, CalendarDays, Repeat, TrendingUp, Target, History, Image as ImageIcon, MessageSquare, CheckCircle2, Circle, SkipForward, HelpCircle } from 'lucide-react';
import { myTasksService } from '@/services/myTasksService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import Image from 'next/image'; // For verification image

// Re-using statusStyles from MyTaskItemCard for consistency (could be moved to a shared util)
const statusStyles = {
  Completed: { text: 'Completed', icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-100' },
  Verified: { text: 'Verified', icon: CheckCircle2, color: 'text-green-700', bgColor: 'bg-green-100' },
  Pending: { text: 'Pending', icon: Circle, color: 'text-gray-600', bgColor: 'bg-gray-100' },
  'In Progress': { text: 'In Progress', icon: Loader2, color: 'text-blue-600', bgColor: 'bg-blue-100', animate: true },
  Skipped: { text: 'Skipped', icon: SkipForward, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  'Awaiting Verification': { text: 'Awaiting Verification', icon: HelpCircle, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  Queried: { text: 'Queried', icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-100' },
};

const formatDate = (dateString, dateFormat = 'MMM d, yyyy') => {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), dateFormat);
  } catch (error) {
    return 'Invalid Date';
  }
};

export default function SystemDetailPage() {
  const router = useRouter();
  const { systemId } = router.query;
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuth();

  const [systemTask, setSystemTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef(null); // For programmatically clicking file input

  useEffect(() => {
    if (!authIsLoading && !isAuthenticated) {
      router.push(`/auth/login?redirect=/systems/${systemId}`);
    }
  }, [isAuthenticated, authIsLoading, router, systemId]);

  const fetchSystemTask = useCallback(async () => {
    if (isAuthenticated && systemId) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await myTasksService.getSystemTaskDetails(systemId);
        if (response.success && response.task) {
          setSystemTask(response.task);
        } else {
          setError(response.message || 'System or task not found.');
          toast.error(response.message || 'System or task not found.');
        }
      } catch (err) {
        setError(err.message || 'Could not load system details.');
        toast.error(err.message || 'Could not load system details.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, systemId]);

  useEffect(() => {
    fetchSystemTask();
  }, [fetchSystemTask]);

  const handleMarkComplete = async () => {
    if (!systemTask || isUpdatingStatus) return;
    setIsUpdatingStatus(true);
    try {
      const response = await myTasksService.updateSystemTaskStatus(systemId, 'Completed');
      if (response.success && response.task) {
        setSystemTask(response.task);
        toast.success(`System "${response.task.name}" marked as Completed!`);
      } else {
        toast.error(response.message || 'Failed to mark as complete.');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred while updating status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    } else {
      setSelectedImageFile(null);
      setImagePreviewUrl(null);
    }
  };

  const clearSelectedImage = () => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
  };
  
  // useEffect to clean up object URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  if (authIsLoading || isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-var(--global-nav-height,80px))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary-accent mb-4" />
        <p className="text-secondary-text-medium">Loading system details...</p>
      </div>
    );
  }

  if (error || !systemTask) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <ScreenHeader title="Error" breadcrumbs={[{label: "Dashboard", href: "/dashboard"}, {label: "My Tasks", href: "/my-tasks"}]} />
        <div className="text-center py-10 px-4">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-primary-text-dark mb-1">System Not Found</h3>
          <p className="text-secondary-text-medium mb-4">{error || "The requested system or task could not be found."}</p>
          <Button onClick={() => router.push('/my-tasks')} variant="outline">Back to My Tasks</Button>
        </div>
      </div>
    );
  }

  const currentStatus = statusStyles[systemTask.status] || statusStyles.Pending;
  const StatusIcon = currentStatus.icon;

  // Placeholder for handleSubmitImageAndComplete - will be added next
  const handleSubmitImageAndComplete = async () => {
    if (!selectedImageFile || !systemTask || isUploadingImage) return;
    setIsUploadingImage(true);
    // Mock URL for now, in real app, this would come from an upload service
    const mockImageUrl = `https://picsum.photos/seed/${systemId}_${Date.now()}/400/300`; 
    try {
      const response = await myTasksService.submitVerificationImage(systemId, mockImageUrl);
      if (response.success && response.task) {
        setSystemTask(response.task);
        toast.success('Image submitted and system marked for verification!');
        clearSelectedImage();
      } else {
        toast.error(response.message || 'Failed to submit image.');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred while submitting image.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <>
      <Head>
        <title>{systemTask.name} - System Details - DuoTrak</title>
        <meta name="description" content={`Detailed view for system: ${systemTask.name}`} />
      </Head>
      <div className="container mx-auto py-4 md:py-6 lg:py-8 px-2 sm:px-4">
        <ScreenHeader 
          title={systemTask.name}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" }, 
            { label: "My Tasks", href: "/my-tasks" },
            { label: systemTask.name, isCurrent: true }
          ]}
        />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-xl">System Overview</CardTitle>
                <Badge variant="outline" className={cn('text-sm px-3 py-1', currentStatus.bgColor, currentStatus.color)}>
                  <StatusIcon size={16} className={cn("mr-2", currentStatus.animate && "animate-spin")} />
                  {currentStatus.text}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-secondary-text-medium mb-1">Goal: <span className="font-medium text-primary-text-dark">{systemTask.goalName || 'N/A'}</span></p>
                <p className="text-sm text-secondary-text-medium mb-3">Assigned: <span className="font-medium text-primary-text-dark">{formatDate(systemTask.assignedDate)}</span></p>
                {systemTask.details && <p className="text-primary-text-dark whitespace-pre-wrap">{systemTask.details}</p>}
              </CardContent>
            </Card>

            {/* Verification Image Card - Updated to show preview during upload */}
            {(systemTask.requiresImageVerification || imagePreviewUrl) && (
              <Card>
                <CardHeader><CardTitle className="text-lg">Verification Image</CardTitle></CardHeader>
                <CardContent>
                  {imagePreviewUrl && (
                     <div className="mb-4">
                        <p className="text-xs font-medium text-secondary-text-medium mb-1">Image Preview:</p>
                        <div className="relative w-full h-48 sm:h-64 rounded-md overflow-hidden border">
                            <Image src={imagePreviewUrl} alt="Selected image preview" layout="fill" objectFit="cover" />
                        </div>
                     </div>
                  )}
                  {systemTask.verificationImageUrl && !imagePreviewUrl && (
                    <div className="relative w-full h-64 rounded-md overflow-hidden border group">
                      <Image src={systemTask.verificationImageUrl} alt={`Verification for ${systemTask.name}`} layout="fill" objectFit="cover" className="group-hover:opacity-90 transition-opacity" />
                    </div>
                  )}
                  {!systemTask.verificationImageUrl && !imagePreviewUrl && systemTask.requiresImageVerification && (
                    <div className="text-center py-8 px-4 border-2 border-dashed rounded-md">
                      <ImageIcon size={48} className="mx-auto text-secondary-text-medium mb-3" />
                      <p className="text-secondary-text-medium mb-1">Image proof required for completion.</p>
                      <p className="text-xs text-gray-500">This system needs an image to be verified by your partner.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {systemTask.partnerComments && systemTask.status === 'Queried' && (
              <Card className="border-red-300 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-lg text-red-700 flex items-center">
                    <MessageSquare size={20} className="mr-2" /> Partner Query
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-red-700">
                  <p className="italic">{systemTask.partnerComments}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader><CardTitle className="text-lg">Recent Activity</CardTitle></CardHeader>
              <CardContent>
                {systemTask.recentActivity && systemTask.recentActivity.length > 0 ? (
                  <ul className="space-y-2">
                    {systemTask.recentActivity.map((activity, index) => (
                      <li key={index} className="text-sm flex justify-between items-center p-2 rounded-md bg-background hover:bg-secondary-beige-light/30">
                        <span>{formatDate(activity.date, 'EEE, MMM d')}: <span className={cn(statusStyles[activity.status]?.color, 'font-medium')}>{activity.status}</span></span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-secondary-text-medium">No recent activity logged for this system.</p>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Sidebar Column for Stats & Actions */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">System Stats</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-secondary-text-medium flex items-center"><Repeat size={16} className="mr-2" /> Schedule:</span>
                  <span className="font-medium text-primary-text-dark">{systemTask.scheduleDescription}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary-text-medium flex items-center"><TrendingUp size={16} className="mr-2" /> Current Streak:</span>
                  <span className="font-medium text-primary-text-dark">{systemTask.currentStreakForSystem} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary-text-medium flex items-center"><Target size={16} className="mr-2" /> Longest Streak:</span>
                  <span className="font-medium text-primary-text-dark">{systemTask.longestStreakForSystem} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary-text-medium flex items-center"><History size={16} className="mr-2" /> Total Completions:</span>
                  <span className="font-medium text-primary-text-dark">{systemTask.totalCompletions} times</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
                <CardHeader><CardTitle className="text-lg">Actions</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    {(systemTask.status === 'Pending' || systemTask.status === 'In Progress') && !systemTask.requiresImageVerification && (
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={handleMarkComplete}
                          disabled={isUpdatingStatus || isUploadingImage}
                        >
                          {isUpdatingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                          {isUpdatingStatus ? 'Completing...' : 'Mark as Complete'}
                        </Button>
                    )}

                    {(systemTask.status === 'Pending' || systemTask.status === 'In Progress') && systemTask.requiresImageVerification && (
                         <div className="space-y-3">
                            {!imagePreviewUrl && (
                                <Button 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => fileInputRef.current?.click()} 
                                    disabled={isUploadingImage}
                                >
                                    <ImageIcon size={16} className="mr-2" /> Select Image for Verification
                                </Button>
                            )}
                            <input 
                                type="file" 
                                accept="image/*" 
                                ref={fileInputRef} 
                                onChange={handleImageFileChange} 
                                className="hidden" 
                            />
                            {imagePreviewUrl && (
                                <div className="space-y-2">
                                    <Button 
                                        className="w-full bg-primary-accent hover:bg-primary-accent-darker"
                                        onClick={handleSubmitImageAndComplete}
                                        disabled={isUploadingImage || !selectedImageFile}
                                    >
                                        {isUploadingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                                        {isUploadingImage ? 'Submitting...' : 'Submit Image & Complete'}
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="w-full text-xs text-red-600 hover:bg-red-100"
                                        onClick={clearSelectedImage}
                                        disabled={isUploadingImage}
                                    >
                                        Cancel / Change Image
                                    </Button>
                                </div>
                            )}
                         </div>
                    )}

                    {systemTask.status === 'Awaiting Verification' && (
                        <p className="text-sm text-yellow-700 text-center py-2 px-3 bg-yellow-100 rounded-md">Waiting for partner verification.</p>
                    )}
                    {(systemTask.status === 'Completed' || systemTask.status === 'Verified') && (
                         <p className="text-sm text-green-700 text-center py-2 px-3 bg-green-100 rounded-md flex items-center justify-center">
                           <CheckCircle2 size={16} className="mr-2 flex-shrink-0" /> System completed!
                         </p>
                    )}
                     {systemTask.status === 'Queried' && (
                        <p className="text-sm text-red-700 text-center py-2 px-3 bg-red-100 rounded-md">Partner has a query. Respond below.</p>
                    )}
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
} 