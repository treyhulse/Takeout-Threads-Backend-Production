'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function DeleteOrganizationSection() {
  const router = useRouter();

  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader>
        <CardTitle className="text-destructive">Delete Organization</CardTitle>
        <CardDescription className="text-destructive/80">
          Once you delete an organization, there is no going back. Please be certain.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          variant="destructive"
          onClick={() => router.push('/dashboard/delete')}
        >
          Delete Organization
        </Button>
      </CardContent>
    </Card>
  );
} 