'use client'

import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface OrganizationLogoProps {
  className?: string;
  orgCode: string;
}

export function OrganizationLogo({ className, orgCode }: OrganizationLogoProps) {
  const { theme, systemTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Ensure we have a definitive theme value
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const logoUrl = isDark 
    ? `https://takeoutthreads.kinde.com/logo_dark?p_org_code=${orgCode}&cache=6929ffad79e742ce9fae156716764d97`
    : `https://takeoutthreads.kinde.com/logo?p_org_code=${orgCode}&cache=6929ffad79e742ce9fae156716764d97`;

  if (error) {
    return (
      <div className={cn("h-8 w-[150px] bg-muted flex items-center justify-center rounded", className)}>
        <span className="text-sm text-muted-foreground">Logo unavailable</span>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <Skeleton className={cn("h-8 w-[150px]", className)} />
      )}
      <Image
        src={logoUrl}
        alt="Organization Logo"
        width={150}
        height={50}
        className={cn(
          "h-8 w-auto",
          isLoading ? "hidden" : "block",
          className
        )}
        priority
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
      />
    </>
  );
} 