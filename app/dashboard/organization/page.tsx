import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { OrganizationUsers } from "@/components/organization/OrganizationUsers";
import { 
  getOrganization, 
  getOrganizationUsers,
  getOrganizationProperties 
} from "@/lib/kinde/actions/organization";
import { OrganizationLogo } from "@/components/OrganizationLogo";
import { CopyButton } from "@/components/CopyButton";
import OrganizationManagement from "@/components/dashboard/OrganizationManagement";

export default async function OrganizationPage() {
  const session = await getKindeServerSession();
  const org = await session.getOrganization();

  if (!org || !org.orgCode) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Organization Management</h1>
        <p>No active organization found. Please sign in again.</p>
      </div>
    );
  }

  try {
    const [orgDetails, usersData, propertiesData] = await Promise.all([
      getOrganization(org.orgCode),
      getOrganizationUsers(org.orgCode),
      getOrganizationProperties(org.orgCode)
    ]);

    const orgDetailsWithProperties = {
      ...orgDetails,
      properties: propertiesData.success ? propertiesData.data : undefined
    };

    return (
      <div className="container mx-auto py-8 max-w-7xl">
        <div className="flex items-center gap-4 mb-8">
          <OrganizationLogo orgCode={org.orgCode} className="h-12 w-auto" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{org.orgName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-muted-foreground">
                {org.orgCode}
              </code>
              <CopyButton value={org.orgCode} />
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          <OrganizationUsers 
            users={usersData?.organization_users || []} 
            orgCode={org.orgCode}
          />
          
          <OrganizationManagement 
            orgDetails={orgDetailsWithProperties}
            orgCode={org.orgCode}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("OrganizationPage: Exception occurred while fetching org details:", error);
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Organization Management</h1>
        <p>Error occurred while fetching organization details. Please try again later.</p>
      </div>
    );
  }
}
