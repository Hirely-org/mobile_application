'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import JobCard from '@/components/JobCard';
import Link from 'next/link';
import { Plus } from 'lucide-react';

type Job = {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  imageId?: string;
};

export default function Home() {
  const { user, isLoading: userLoading } = useUser();
  const [idToken, setIdToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const res = await fetch('/token');
        if (!res.ok) throw new Error('Failed to fetch token');

        const data = await res.json();
        setIdToken(data.idToken);
      } catch (error) {
        console.error('Error fetching token:', error);
        setError('Failed to fetch authentication token');
      }
    })();
  }, [user]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!idToken || !user) return;
      
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8000/jobread', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get role from response header
        console.log('Response:', response.headers.get('X-Forwarded-Role'));
        console.log('All header keys:', [...response.headers.keys()]);
        console.log('All header values:', [...response.headers.values()]);
        console.log('All header entries:', [...response.headers.entries()]);
        const role = response.headers.get('X-Forwarded-Role');
        console.log('Role:', role);
        setUserRole(role);
    
        const jobsData = await response.json();
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to fetch jobs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [idToken, user]);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-8 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome {user?.name ? user.name : 'Guest'}
              </h1>
              {userRole === 'Admin' && (
                <Link href="/job/create">
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Job
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Card>

        {user ? (
          <>
            {isLoading && (
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {jobs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            {!isLoading && !error && jobs.length === 0 && (
              <Card className="p-6 text-center text-gray-500">
                No jobs found.
              </Card>
            )}
          </>
        ) : (
          <Card className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Please log in to view jobs</h2>
            <p className="text-gray-600 mb-6">
              Access our job listings and apply to opportunities by logging in to your account.
            </p>
            <Link href="/api/auth/login">
              <Button size="lg">
                Log In to Continue
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}