// components/ApplyButton.tsx
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ApplyButtonProps {
  jobId: string | number;
  idToken: string;
}

export default function ApplyButton({ jobId, idToken }: ApplyButtonProps) {
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const response = await fetch('http://localhost:8000/jobApplication', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      });

      if (!response.ok) {
        throw new Error('Failed to apply for job');
      }

      alert('Successfully applied to job!');
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to apply for job');
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