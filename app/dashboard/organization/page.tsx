import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiSecret}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("OrganizationPage: Error fetching organization details:", res.statusText);
      return (
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Organization Management</h1>
          <p>Error fetching organization details. Please try again later.</p>
        </div>
      );
    }

    const orgDetails = await res.json();

    // Fetch organization users with query parameters
    const usersRes = await fetch(
      `${normalizedBaseUrl}/organizations/${orgCode}/users`, {
      headers: {
        Authorization: `Bearer ${apiSecret}`,
      },
      cache: "no-store",
    });

    if (!usersRes.ok) {
      console.error("OrganizationPage: Error fetching organization users:", usersRes.statusText);
    }

    const usersData = await usersRes.json();
    
    // Update the user display to show more fields based on the API response
    return (
      <div className="container mx-auto py-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Organization Management</h1>
        
        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-6">
                {Object.entries(orgDetails).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium capitalize">
                      {key.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm">
                      {value ? value.toString() : "-"}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Organization Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {usersData?.organization_users?.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {user.picture && (
                        <img 
                          src={user.picture} 
                          alt={user.full_name} 
                          className="h-10 w-10 rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-medium">{user.email}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.first_name} {user.last_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end text-sm text-muted-foreground">
                      <p>Joined: {new Date(user.joined_on).toLocaleDateString()}</p>
                      <p>Roles: {user.roles?.join(", ") || "None"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
