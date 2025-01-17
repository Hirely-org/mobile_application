'use client';

import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar } from "lucide-react";

interface Job {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  imageId?: string;
}

export default function JobDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  // Fetch token first
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch('/login');  // Make sure this is the correct path
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

  // Fetch job details once we have the token
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!idToken) return; // Don't fetch if we don't have the token

      try {
        const response = await fetch(`http://localhost:8000/jobread/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        });
        
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
  }, [idToken, params.id]);

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
        {/* Header Card */}
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-3xl font-bold">{job.name}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {job.status}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Posted {new Date(job.createdAt).toLocaleDateString()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Description Card */}
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{job.description}</p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="flex justify-between items-center p-6">
            <Button 
              variant="outline"
              onClick={() => router.back()}
            >
              Back to Jobs
            </Button>
            <Button>Apply Now</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}