import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { useState } from 'react';

interface Job {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  imageId?: string;  // Changed from imageId
  originalImageUrl?: string;
  processedImageUrl?: string;
}

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const [imageError, setImageError] = useState(false);
  console.log("JOB LOG",job);
  // Determine which image URL to use
  const imageUrl = !imageError && job.processedImageUrl 
    ? job.processedImageUrl 
    : job.originalImageUrl 
    ? job.originalImageUrl 
    : '/default-job-image.jpg';

  return (
    <Link href={`/job/${job.id}`} className='cursor-pointer block'>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative w-full h-48">
          {/* Remove priority unless it's one of the first few items */}
          <Image
            src={imageUrl}
            alt={job.name}
            fill
            className="object-cover"
            onError={() => {
              // If processed image fails, try original image
              if (imageUrl === job.processedImageUrl) {
                setImageError(true);
              }
            }}
            unoptimized={!!job.processedImageUrl || !!job.originalImageUrl} // Skip optimization for S3 URLs
          />
        </div>
        
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-bold tracking-tight">{job.name}</h3>
            <Badge 
              variant={job.status === 'OPEN' ? 'default' : 'secondary'}
              className="ml-2"
            >
              {job.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-gray-600 line-clamp-2">
            {job.description}
          </p>
        </CardContent>

        <CardFooter className="flex justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(job.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            {new Date(job.createdAt).toLocaleTimeString()}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default JobCard;