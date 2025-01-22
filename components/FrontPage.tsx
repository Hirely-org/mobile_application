'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Adjust to your button component path
import { useEffect } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect if user is logged in
    if (user) {
      router.push('/job'); // Redirect to jobs page if logged in
    }
  }, [user, router]);

  if (isLoading) {
    return <div>Loading...</div>; // Show loading state while checking
  }

  if (user) {
    return null; // Do not render anything if redirecting
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to Hirely</h1>
      <p className="mb-8">Your gateway to exciting job opportunities!</p>
      <Link href="/api/auth/login">
        <Button className="px-6 py-3 bg-blue-500 text-white rounded-lg">
          Log In
        </Button>
      </Link>
    </div>
  );
}
