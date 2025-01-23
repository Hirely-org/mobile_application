// 'use client';

// import { useEffect, useState } from 'react';
// import { notFound, useRouter } from 'next/navigation';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import ApplyButton from '@/components/ApplyButton';
// import Image from 'next/image';
// import apiURL from '../../../config';

// interface Job {
//   id: number;
//   name: string;
//   description: string;
//   status: string;
//   createdAt: string;
//   imageId?: string;
//   originalImageUrl?: string;  // Add this
//   processedImageUrl?: string; // Add this
// }
// interface PageProps {
//   params: {
//     id: string;
//   };
//   searchParams?: { [key: string]: string | string[] | undefined };
// }

// export default function JobDetails({ params }: PageProps) {
//   const router = useRouter();
//   const [job, setJob] = useState<Job | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [idToken, setIdToken] = useState<string | null>(null);
//   const [imageError, setImageError] = useState(false);

//   const imageUrl = job && !imageError && job.processedImageUrl 
//   ? job.processedImageUrl 
//   : job?.originalImageUrl 
//   ? job.originalImageUrl 
//   : '/default-job-image.jpg';

//   // Fetch token first
//   useEffect(() => {
//     const fetchToken = async () => {
//       try {
//         const res = await fetch('/token');  // Make sure this is the correct path
//         if (!res.ok) throw new Error('Failed to fetch token');

//         const data = await res.json();
//         setIdToken(data.idToken);
//       } catch (error) {
//         console.error('Error fetching token:', error);
//         setError('Failed to fetch authentication token');
//       }
//     };

//     fetchToken();
//   }, []);

//   // Fetch job details once we have the token
//   useEffect(() => {
//     const fetchJobDetails = async () => {
//       if (!idToken) return; // Don't fetch if we don't have the token

//       try {
//         const response = await fetch(`http://traefik.traefik.svc.cluster.local:5000/jobRead/${params.id}`, {
//           headers: {
//             'Authorization': `Bearer ${idToken}`,
//           },
//         });
        
//         if (!response.ok) {
//           throw new Error('Job not found');
//         }
        
//         const data = await response.json();
//         setJob(data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to fetch job details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobDetails();
//   }, [idToken, params.id]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   if (error || !job) {
//     return notFound();
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto space-y-6">
//         {/* Add this Image Card */}
//         <Card>
//           <div className="relative w-full h-[400px]">
//             <Image
//               src={imageUrl}
//               alt={job?.name || 'Job image'}
//               fill
//               className="object-cover rounded-t-lg"
//               onError={() => {
//                 if (imageUrl === job?.processedImageUrl) {
//                   setImageError(true);
//                 }
//               }}
//               unoptimized={!!job?.processedImageUrl || !!job?.originalImageUrl}
//             />
//           </div>
//         </Card>

//         {/* Description Card */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Job Description</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-gray-600">{job.description}</p>
//           </CardContent>
//         </Card>

//         {/* Action Buttons */}
//         <Card>
//           <CardContent className="flex justify-between items-center p-6">
//             <Button 
//               variant="outline"
//               onClick={() => router.back()}
//             >
//               Back to Jobs
//             </Button>
//             {idToken && (
//               <ApplyButton 
//                 jobId={params.id} 
//                 idToken={idToken}
//               />
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// app/job/[id]/page.tsx (Server Component)
import JobDetailsClient from './JobDetailsClient';

export default async function JobDetailsPage({ params }: { params: { id: string } }) {
  console.log('paramsJOBDETAISLPAGE:', params);
  return <JobDetailsClient params={params} />;
}