import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrganizationInfo } from "@/components/organization/OrganizationInfo";
import { OrganizationUsers } from "@/components/organization/OrganizationUsers";
import { getOrganization, getOrganizationUsers } from "@/lib/kinde/kindeActions";

export default async function OrganizationPage() {

  // Retrieve the server session.
  const session = await getKindeServerSession();

  // Get the current organization using getOrganization().
  const org = await session.getOrganization();

  if (!org || !org.orgCode) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Organization Management</h1>
        <p>No active organization found. Please sign in again.</p>
      </div>
    );
  }

  const orgCode = org.orgCode;

  // Retrieve your M2M API credentials from environment variables.
  const baseUrl = process.env.KINDE_BASE_URL;
  const apiSecret = process.env.KINDE_API_SECRET;

  // Normalize baseUrl (remove any trailing slash) and build the API URL.
  const normalizedBaseUrl = baseUrl ? baseUrl.replace(/\/$/, "") : "";
  const apiUrl = `${normalizedBaseUrl}/organization?code=${orgCode}`;

  try {
    // Use kindeActions functions instead of direct fetch calls
    const [orgDetails, usersData] = await Promise.all([
      getOrganization(org.orgCode),
      getOrganizationUsers(org.orgCode)
    ]);

    return (
      <div className="container mx-auto py-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Organization Management</h1>
        
        <div className="space-y-8">
          <OrganizationInfo orgDetails={orgDetails} />
          <OrganizationUsers 
            users={usersData?.organization_users || []} 
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
