// app/job/[id]/JobDetailsClient.tsx (Client Component)
'use client';

import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ApplyButton from '@/components/ApplyButton';
import Image from 'next/image';

interface Job {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  imageId?: string;
  originalImageUrl?: string;
  processedImageUrl?: string;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function JobDetailsClient({ params }: PageProps) {
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [idToken, setIdToken] = useState<string | null>(null);


  const imageUrl = job && !imageError && job.processedImageUrl 
    ? job.processedImageUrl 
    : job?.originalImageUrl 
    ? job.originalImageUrl 
    : '/default-job-image.jpg';

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch('/token');
        if (!res.ok) throw new Error('Failed to fetch token');
        const data = await res.json();
        setIdToken(data.idToken);
      } catch (error) {
        console.error('Error fetching token:', error);
        setError('Failed to fetch authentication token');
      }
    };
  
    fetchToken();
  }, []);

  useEffect(() => {
    const fetchJobDetails = async () => {
      console.log("JOBDETAILSCLIENT",params.id);
      try {
        const response = await fetch(`/api/jobs/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Job not found');
        }
        
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !job) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <div className="relative w-full h-[400px]">
            <Image
              src={imageUrl}
              alt={job?.name || 'Job image'}
              fill
              className="object-cover rounded-t-lg"
              onError={() => {
                if (imageUrl === job?.processedImageUrl) {
                  setImageError(true);
                }
              }}
              unoptimized={!!job?.processedImageUrl || !!job?.originalImageUrl}
            />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{job.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex justify-between items-center p-6">
            <Button 
              variant="outline"
              onClick={() => router.back()}
            >
              Back to Jobs
            </Button>
            <ApplyButton jobId={params.id} idToken={idToken || ''}/>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}