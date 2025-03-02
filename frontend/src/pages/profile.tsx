import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';


export function Profile() {
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = React.useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = React.useState(user?.photoURL || '');
  
  const handleUpdateProfile = async () => {
    if (user) {
      await updateProfile({
        displayName,
        photoURL
      });
    }
  };

  return (
    <div className="container max-w-2xl py-10 space-y-8">
      <h1 className="text-3xl font-bold">Profile Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your profile details and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={photoURL || undefined} alt={displayName || 'User'} />
              <AvatarFallback>{displayName?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Label htmlFor="picture">Profile Picture</Label>
              <Input
                id="picture"
                type="url"
                placeholder="Enter image URL"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
            />
          </div>

          <Button onClick={handleUpdateProfile}>Save Changes</Button>
        </CardContent>
      </Card>


    </div>
  );
}