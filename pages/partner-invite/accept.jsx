import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context/AuthContext';
import { partnershipService } from '../../services/partnershipService';

import DesktopTopNavLayout from '../../components/layout/DesktopTopNavLayout';
import MobileTabLayout from '../../components/layout/MobileTabLayout';
import useResponsiveBreakpoints from '../../lib/hooks/useResponsiveBreakpoints';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useToast } from '../../components/ui/use-toast';

const AcceptInvitationPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { user, setPartnership } = useContext(AuthContext);
  const { invite_token } = router.query;

  const [inviteState, setInviteState] = useState('verifying'); // verifying, invalid, needsAuth, canAccept, accepting
  const [inviteDetails, setInviteDetails] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!router.isReady) return;

    if (!invite_token) {
      setInviteState('invalid');
      setError('No invitation token was found. The link may be incomplete.');
      return;
    }

    const verifyToken = async () => {
      setInviteState('verifying');
      const response = await partnershipService.getInviteDetails(invite_token);
      if (response.success) {
        setInviteDetails(response.inviter);
        if (user) {
          setInviteState('canAccept');
        } else {
          setInviteState('needsAuth');
        }
      } else {
        setInviteState('invalid');
        setError(response.error || 'This invitation link is invalid, has expired, or has already been used.');
      }
    };

    verifyToken();
  }, [invite_token, router.isReady, user]);

  const handleAccept = async () => {
    setInviteState('accepting');
    const response = await partnershipService.acceptPartnershipInvite(invite_token);

    if (response.success) {
      // In a real app, this would update the user's context to include the new partnership info
      // For now, we can simulate this.
      setPartnership(response.partnership);
      toast({
        title: "Partnership accepted!",
        description: `You are now partners with ${inviteDetails.username}.`,
        variant: 'success',
      });
      router.push('/dashboard');
    } else {
      toast({
        title: "Failed to accept invitation",
        description: response.error || "An unexpected error occurred.",
        variant: 'destructive',
      });
      setInviteState('canAccept');
    }
  };

  const renderContent = () => {
    switch (inviteState) {
      case 'verifying':
        return (
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary-accent" />
            <p className="text-secondary-text-medium">Verifying invitation...</p>
          </div>
        );
      case 'invalid':
        return (
          <div>
            <CardTitle className="text-center text-h1">Invitation Problem</CardTitle>
            <CardContent className="pt-6">
              <p className="text-body-standard text-center">{error}</p>
              <Link href="/dashboard" legacyBehavior>
                <Button variant="primary" className="w-full mt-6">Go to Dashboard</Button>
              </Link>
            </CardContent>
          </div>
        );
      case 'needsAuth':
        return (
          <div>
            <CardHeader>
              <CardTitle className="text-center text-h1">{inviteDetails?.username} has invited you!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body-standard text-center mb-6">
                {inviteDetails?.username} has invited you to be their accountability partner on DuoTrak! Please log in or sign up to accept.
              </p>
              <Link href={`/auth/login?redirect=/partner-invite/accept?invite_token=${invite_token}`} legacyBehavior>
                <Button variant="primary" className="w-full">Log In to Accept</Button>
              </Link>
              <Link href={`/auth/signup?redirect=/partner-invite/accept?invite_token=${invite_token}`} legacyBehavior>
                <Button variant="secondary" className="w-full mt-sm">Sign Up to Accept</Button>
              </Link>
            </CardContent>
          </div>
        );
      case 'canAccept':
      case 'accepting':
        return (
          <div>
            <CardHeader>
              <CardTitle className="text-center text-h1">Partnership Invitation</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-md">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={inviteDetails?.profileImageUrl} alt={`${inviteDetails?.username}'s profile picture`} />
                  <AvatarFallback>{inviteDetails?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <p className="text-lg font-medium text-center">
                  {inviteDetails?.username} wants to be your accountability partner on DuoTrak!
                </p>
                <div className="flex gap-md mt-lg w-full">
                    <Button
                        variant="primary"
                        className="flex-1"
                        isLoading={inviteState === 'accepting'}
                        onClick={handleAccept}
                    >
                        Accept Invitation
                    </Button>
                    <Button
                        variant="text"
                        className="flex-1"
                        disabled={inviteState === 'accepting'}
                        onClick={() => router.push('/dashboard')}
                    >
                        Decline
                    </Button>
                </div>
            </CardContent>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-beige p-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="w-full max-w-md mx-auto">
          {renderContent()}
        </Card>
      </motion.div>
    </div>
  );
};


// This page should not have the standard layout with nav bars, so we define a custom Layout.
AcceptInvitationPage.getLayout = function getLayout(page) {
  // A simple layout wrapper that doesn't include the main navigation.
  // This could be a fragment or a div that just renders the children.
  return <>{page}</>;
};


export default AcceptInvitationPage; 