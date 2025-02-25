"use client";
import {KindeProvider} from "@kinde-oss/kinde-auth-nextjs";
import { useState, useEffect } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { OrganizationOnboarding } from "@/components/dashboard/OrganizationOnboarding";

const DEFAULT_ORG_CODE = "org_81042819ee5";

function OrganizationCheck({ children }: { children: React.ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user, organization } = useKindeAuth();

  useEffect(() => {
    const hasValidOrg = organization?.orgCode && 
                       organization.orgCode !== DEFAULT_ORG_CODE;

    if (user && !hasValidOrg) {
      setShowOnboarding(true);
    }
  }, [user, organization]);

  return (
    <>
      {children}
      <OrganizationOnboarding 
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </>
  );
}

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  return (
    <KindeProvider>
      <OrganizationCheck>
        {children}
      </OrganizationCheck>
    </KindeProvider>
  );
};