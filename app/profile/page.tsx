// app/profile/page.tsx
'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Loader2 } from "lucide-react";

export default function Profile() {
  const { user } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!user) {
    return <p>You need to log in to view this page.</p>;
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch('/api/users/delete', {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      window.location.href = '/api/auth/logout';
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Profile</h1>
      <Image 
        src={user.picture || '/default-profile.png'} 
        alt={user.name || 'Profile picture'} 
        width={128}
        height={128}
        className="rounded-full mt-4" 
        priority
      />
      <p className="mt-2 text-lg">{user.name}</p>
      <p className="text-sm text-gray-500">{user.email}</p>
      <Button 
        variant="destructive"
        className="mt-4"
        onClick={handleDeleteAccount}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Deleting Account...
          </>
        ) : (
          'Delete Account'
        )}
      </Button>
    </div>
  );
}