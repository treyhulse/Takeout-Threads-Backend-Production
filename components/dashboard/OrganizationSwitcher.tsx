"use client";

import React, { useState } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"; // shadcn dropdown-menu component
import { PlusCircle } from "lucide-react";
import { CreateOrgLink } from "@kinde-oss/kinde-auth-nextjs/components";

const OrganizationSwitcher: React.FC = () => {
  const { getClaim, getOrganization } = useKindeAuth();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");

  // Get the organizations claim from the ID token.
  const orgClaim = getClaim("organizations", "id_token");
  const organizations = Array.isArray(orgClaim?.value) ? orgClaim.value : [];
  const currentOrg = getOrganization();

  // Use the current organization's name if available.
  const currentOrgName = currentOrg?.orgName || "Select Organization";

  // List organizations excluding the current one.
  const otherOrgs = organizations.filter(
    (org: { id: string; name: string }) => org.id !== currentOrg?.orgCode
  );

  // To switch organizations, we redirect to the login endpoint with the org_code query parameter.
  const handleOrgSwitch = (orgId: string) => {
    router.push(
      `/api/auth/login?org_code=${orgId}&post_login_redirect_url=/dashboard`
    );
  };

  return (
    <div className="w-56">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-between w-full px-4 py-2 border rounded-md">
            <span>{currentOrgName}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {/* Display the current organization at the top (non-clickable) */}
          <DropdownMenuItem disabled>
            <span className="font-semibold">{currentOrgName}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* List other organizations */}
          {otherOrgs.map((org: { id: string; name: string }) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => handleOrgSwitch(org.id)}
            >
              {org.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Organization
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-md w-80">
            <h3 className="text-lg font-medium mb-4">Create New Organization</h3>
            <input
              type="text"
              placeholder="Organization Name"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-md border"
              >
                Cancel
              </button>
              {newOrgName ? (
                <CreateOrgLink orgName={newOrgName}>
                  <button className="px-4 py-2 rounded-md bg-blue-500 text-white">
                    Create
                  </button>
                </CreateOrgLink>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 rounded-md bg-blue-300 text-white"
                >
                  Create
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationSwitcher;
