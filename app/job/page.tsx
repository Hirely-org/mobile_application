// 'use client'; // This is required for client-side data fetching in Next.js

// import { useEffect, useState } from 'react';
// import JobCard from '@/components/JobCard';

// interface Job {
//   id: number; // Unique job ID
//   name: string;
//   description: string;
//   status: string;
//   createdAt: string; // ISO Date string
//   imageId?: string; // Optional
// }

// const JobsPage = () => {
//   const [jobs, setJobs] = useState<Job[]>([]); // Define the type of jobs based on the structure of your job data
//   const [loading, setLoading] = useState<boolean>(true); // State to track loading
//   const [error, setError] = useState<string | null>(null); // State to track errors

//   // Fetch jobs from the backend
//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const res = await fetch('/token');
//         console.log("RESPONSE PAGEJOB",res, "KJAFJASNFKAFNKSJFn");
//         const response = await fetch('http://localhost:8000/jobread', {
//           method: 'GET',
//           headers: {
//             // Make sure to add Authorization if required
//             Authorization: `Bearer ${localStorage.getItem('idToken')}`, // Replace with actual method of retrieving token
//           },
//         });
        
//         if (!response.ok) {
//           throw new Error(`Error: ${response.statusText}`);
//         }
        
//         const data = await response.json();
//         setJobs(data); // Set the fetched jobs data
//       } catch (err) {
//         console.error('Failed to fetch jobs:', err);
//         setError('Failed to load jobs. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, []);

//   if (loading) {
//     return <div>Loading jobs...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8">
//       {jobs.map((job) => (
//         <JobCard key={job.id} job={job} /> // Pass the entire job object to JobCard
//       ))}
//     </div>
//   );
// };

// export default JobsPage;
