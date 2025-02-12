'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteOrganization } from "@/lib/kinde/actions/organization";
import { useRouter } from "next/navigation";

interface DeleteOrganizationButtonProps {
  orgCode: string;
  orgName: string;
}

export function DeleteOrganizationButton({ orgCode, orgName }: DeleteOrganizationButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const router = useRouter();

  const isConfirmed = confirmation === orgName;

  const handleDelete = async () => {
    if (!isConfirmed) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteOrganization(orgCode);
      if (result.success) {
        // Use Kinde's logout endpoint without specifying a redirect URL
        // This will use KINDE_POST_LOGOUT_REDIRECT_URL from your environment
        window.location.href = '/api/auth/logout';
      } else {
        console.error('Failed to delete organization:', result.error);
      }
    } catch (error) {
      console.error('Error deleting organization:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2">
        <label htmlFor="confirm" className="text-sm text-muted-foreground">
          Type <span className="font-semibold">{orgName}</span> to confirm
        </label>
        <Input
          id="confirm"
          type="text"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          placeholder="Enter organization name"
          className="max-w-md"
        />
      </div>
      
      <Button 
        variant="destructive" 
        onClick={handleDelete}
        disabled={!isConfirmed || isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete Organization"}
      </Button>
    </div>
  );
} 