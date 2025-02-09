import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { DeleteOrganizationButton } from "@/components/dashboard/DeleteOrganizationButton";

export default async function DeleteOrganizationPage() {
  const { getOrganization } = await getKindeServerSession();
  const org = await getOrganization();

  if (!org || !org.orgCode) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Delete Organization</h1>
        <p>No active organization found. Please sign in again.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-3 bg-destructive/10 rounded-full">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          
          <h1 className="text-2xl font-bold">Delete Organization</h1>
          
          <p className="text-muted-foreground">
            Are you sure you want to delete <span className="font-semibold">{org.orgName}</span>? 
            This action cannot be undone and will permanently delete all associated data.
          </p>

          <div className="flex flex-col items-center gap-4 w-full">
            <DeleteOrganizationButton orgCode={org.orgCode} orgName={org.orgName} />
            
            <Link href="/dashboard/organization">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
