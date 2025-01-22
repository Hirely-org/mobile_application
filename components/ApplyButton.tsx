import { useState } from 'react';
import { useRouter } from 'next/navigation';  // Add this import
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from 'react-hot-toast';
import apiURL from '../config';


interface ApplyButtonProps {
  jobId: string | number;
  idToken: string;
}

export default function ApplyButton({ jobId, idToken }: ApplyButtonProps) {
  const [isApplying, setIsApplying] = useState(false);
  const router = useRouter();  // Add this

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const response = await fetch(`${apiURL}/jobApplication`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          toast({
            title: "Already Applied",
            description: data.message || "You have already applied to this job",
            variant: "destructive",
          });
          return;
        }
        throw new Error(data.message || 'Failed to apply for job');
      }

      toast({
        title: "Application Submitted",
        description: "Your job application was submitted successfully!",
      });
      
      // Add slight delay before redirect to ensure toast is visible
      setTimeout(() => {
        router.push('/');  // Redirect to home page
      }, 1500);

    } catch (error) {
      console.error('Error applying for job:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to apply for job',
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Button 
      onClick={handleApply} 
      disabled={isApplying}
    >
      {isApplying ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Applying...
        </>
      ) : (
        'Apply Now'
      )}
    </Button>
  );
}