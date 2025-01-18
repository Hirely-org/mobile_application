'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Profile() {
  const { user } = useUser();

  if (!user) {
    return <p>You need to log in to view this page.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Profile</h1>
      <Image 
        src={user.picture || '/default-profile.png'} 
        alt={user.name || 'Profile picture'} 
        width={128} // width in pixels
        height={128} // height in pixels
        className="rounded-full mt-4" 
        priority // Ensures the image is loaded as a high priority for LCP optimization
        />
      <p className="mt-2 text-lg">{user.name}</p>
      <p className="text-sm text-gray-500">{user.email}</p>
      <Button className="mt-4 bg-red-600 hover:bg-red-700 text-white">
        Delete Account
      </Button>
    </div>
  );
}
