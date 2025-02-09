'use client'

import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface OrganizationLogoProps {
  className?: string;
  orgCode: string;
}

export function OrganizationLogo({ className, orgCode }: OrganizationLogoProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const logoUrl = isDark 
    ? `https://takeoutthreads.kinde.com/logo_dark?p_org_code=${orgCode}`
    : `https://takeoutthreads.kinde.com/logo?p_org_code=${orgCode}`;

  return (
    <Image
      src={logoUrl}
      alt="Organization Logo"
      width={150}
      height={50}
      className={cn("h-8 w-auto", className)}
      priority
    />
  );
} 