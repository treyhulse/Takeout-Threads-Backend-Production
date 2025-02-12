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
import { OrganizationOnboarding } from "./OrganizationOnboarding";

const OrganizationSwitcher: React.FC = () => {
  const { getClaim, getOrganization } = useKindeAuth();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

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

      <OrganizationOnboarding 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </div>
  );
};

export default OrganizationSwitcher;
