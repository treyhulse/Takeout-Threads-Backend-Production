'use server'

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { OrganizationLogo } from "@/components/OrganizationLogo";

export async function OrganizationProvider() {
  const { getOrganization } = getKindeServerSession();
  const org = await getOrganization();

  return <OrganizationLogo orgCode={org?.orgCode || ''} />;
} 