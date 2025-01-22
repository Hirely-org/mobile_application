'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Loader2 } from "lucide-react";
import apiURL from '../../config';


export default function Profile() {
  const { user } = useUser();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [idToken, setIdToken] = useState<string | null>(null);


  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch('/token');
        if (!res.ok) throw new Error('Failed to fetch token');

        const data = await res.json();
        setIdToken(data.idToken);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken();
  }, []);

  if (!user) {
    return <p>You need to log in to view this page.</p>;
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`${apiURL}/users`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`, // If needed
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      // Redirect to logout after successful deletion
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