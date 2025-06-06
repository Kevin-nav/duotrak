import React from 'react';
import Head from 'next/head';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import Link from 'next/link';
import { Separator } from "@/components/ui/separator";
import { Edit3 } from 'lucide-react';

// Mock user data - in a real app, this would come from context or a hook
const mockUser = {
  name: 'Jamie Lannister',
  email: 'jamie@example.com',
  avatarUrl: 'https://github.com/shadcn.png', // Placeholder avatar
};

// Mock notification preferences
const mockNotificationPrefs = [
  { id: 'systemUpdates', label: 'System Updates', checked: true },
  { id: 'goalProgress', label: 'Goal Progress & Streaks', checked: true },
  { id: 'partnerVerifications', label: 'Partner Verifications', checked: false },
  { id: 'newMessages', label: 'New Messages', checked: true },
  { id: 'goalReminders', label: 'Goal Reminders', checked: true },
];

export default function SettingsPage() {
  const [notificationPrefs, setNotificationPrefs] = React.useState(mockNotificationPrefs);

  const handleNotificationToggle = (id) => {
    setNotificationPrefs(
      notificationPrefs.map(pref => 
        pref.id === id ? { ...pref, checked: !pref.checked } : pref
      )
    );
    // In a real app, you'd also save this preference to the backend
    console.log(`Toggled ${id}`);
  };

  const handleChangePassword = () => {
    // Mock action
    alert("Change Password clicked. Implement modal or navigation.");
  };

  const handleDeleteAccount = () => {
    // Mock action with confirmation
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deletion initiated. (This is a mock action)");
      // Implement actual account deletion logic here
    }
  };

  const handleChangePicture = () => {
    alert("Change Picture clicked. Implement file upload logic.");
    // This would typically open a file input or a modal for cropping/uploading
  };

  return (
    <>
      <Head>
        <title>Settings - DuoTrak</title>
      </Head>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-primary-text-dark mb-8">Settings</h1>

        {/* Profile Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>View and manage your public profile information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
              <div className="relative group">
                <Avatar className="h-24 w-24 sm:h-28 sm:w-28">
                  <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
                  <AvatarFallback>{mockUser.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Button 
                  variant="outline"
                  size="icon"
                  className="absolute bottom-1 right-1 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-card-modal-background/80 hover:bg-card-modal-background"
                  onClick={handleChangePicture}
                  aria-label="Change profile picture"
                >
                  <Edit3 className="h-4 w-4 text-primary-text-dark" />
                </Button>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xl font-semibold text-primary-text-dark">{mockUser.name}</p>
                <p className="text-sm text-secondary-text-medium">{mockUser.email}</p>
              </div>
            </div>
            <Separator className="my-6" />
            <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={mockUser.name} readOnly className="mt-1 bg-secondary-beige-light/30" />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={mockUser.email} readOnly className="mt-1 bg-secondary-beige-light/30" />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Link href="/profile/edit" passHref legacyBehavior>
              <Button asChild><a className="ml-auto">Edit Profile</a></Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Account Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account security and preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleChangePassword}>Change Password</Button>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose what activities you want to be notified about.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notificationPrefs.map((pref) => (
              <div key={pref.id} className="flex items-center justify-between">
                <Label htmlFor={pref.id} className="flex-grow cursor-pointer">{pref.label}</Label>
                <Switch 
                  id={pref.id} 
                  checked={pref.checked} 
                  onCheckedChange={() => handleNotificationToggle(pref.id)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Theme Settings (Mock) */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Theme Settings</CardTitle>
            <CardDescription>Select your preferred application theme.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Button variant="outline" aria-pressed="true">Light</Button>
              <Button variant="ghost">Dark</Button>
              <Button variant="ghost">System</Button>
            </div>
            <p className="text-xs text-secondary-text-medium mt-2">Dark mode coming soon!</p>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-error-red">
          <CardHeader>
            <CardTitle className="text-error-red">Danger Zone</CardTitle>
            <CardDescription>Manage critical account actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
            <p className="text-xs text-secondary-text-medium mt-2">This action is permanent and cannot be undone.</p>
          </CardContent>
        </Card>

      </div>
    </>
  );
} 