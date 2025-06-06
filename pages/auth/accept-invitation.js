import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

import { partnershipService } from '@/services/partnershipService';
import { useAuth } from '@/context/AuthContext'; // To potentially check auth state
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AcceptInvitationPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth(); // Get user auth state
  const [isLoading, setIsLoading] = useState(false);
  const [invitationToken, setInvitationToken] = useState(null);
  const [error, setError] = useState(null);
  const [inviterName, setInviterName] = useState("Your Partner"); // Mock inviter name

  useEffect(() => {
    if (router.isReady) {
      const { token } = router.query;
      if (token) {
        setInvitationToken(token);
        setError(null);
        // In a real app, you might fetch invitation details using the token here
        // to display more specific information, like the inviter's actual name.
      } else {
        setError("Invitation token is missing or invalid.");
        toast.error("Invalid or missing invitation token.");
      }
    }
  }, [router.isReady, router.query]);

  const handleAcceptInvitation = async () => {
    if (!invitationToken) {
      toast.error("Invitation token is not available.");
      return;
    }
    if (!isAuthenticated && !authLoading) {
        //This page should ideally be protected or handle unauthenticated users gracefully
        //For now, we will allow proceeding, but a real app would force login/signup first
        //if the invitation requires an existing account to link to.
        toast.info("Please ensure you are logged in to accept the invitation.");
        // router.push(`/auth/login?redirect=/auth/accept-invitation?token=${invitationToken}`);
        // return;
    }

    setIsLoading(true);
    try {
      const response = await partnershipService.acceptInvitation(invitationToken);
      if (response.success) {
        toast.success(response.message || 'Invitation accepted successfully!');
        // Redirect to a partnership setup page or dashboard
        router.push('/dashboard'); // Or perhaps '/partnership/setup'
      } else {
        toast.error(response.message || 'Failed to accept invitation.');
      }
    } catch (err) {
      console.error("Accept invitation error:", err);
      toast.error(err.message || 'An unexpected error occurred.');
    }
    setIsLoading(false);
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading authentication status...</p></div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary-beige p-4">
        <Card className="w-full max-w-md shadow-duotrak-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-error-red">Accept Invitation Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-error-red">{error}</p>
            <Button onClick={() => router.push('/')} className="mt-4">Go to Homepage</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!invitationToken && !router.isReady) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading invitation...</p></div>;
  }
  if (!invitationToken && router.isReady && !error) { // Should be caught by error state, but as a fallback
      setError("Invitation token is missing.");
      return null; // Error state will render UI
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-beige p-4">
      <Card className="w-full max-w-md shadow-duotrak-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary-accent">You're Invited!</CardTitle>
          <CardDescription>
            {inviterName} has invited you to join them on DuoTrak.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6">Ready to start achieving your goals together?</p>
          <Button 
            onClick={handleAcceptInvitation} 
            className="w-full" 
            disabled={isLoading || !invitationToken}
          >
            {isLoading ? 'Accepting Invitation...' : 'Accept Invitation & Get Started'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 