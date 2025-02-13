'use client'

import Link from "next/link"
import { cn } from "@/lib/utils"
import { CheckCircle, AlertCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DomainLinkProps {
  domain?: string | null
  subdomain: string
  isVerified: boolean
  variant?: 'text' | 'button'
}

export function DomainLink({ domain, subdomain, isVerified, variant = 'text' }: DomainLinkProps) {
  const href = isVerified && domain 
    ? `https://${domain}` 
    : `https://${subdomain}.takeout-threads.app`

  if (variant === 'button') {
    return (
      <Button variant="outline" size="sm" asChild className="w-full">
        <Link href={href} target="_blank">
          <ExternalLink className="mr-2 h-4 w-4" />
          Visit Site
        </Link>
      </Button>
    )
  }

  return (
    <Link 
      href={href}
      target="_blank"
      onClick={(e) => isVerified ? null : e.preventDefault()}
      className={cn(
        "text-sm block truncate",
        isVerified 
          ? "text-blue-500 hover:underline" 
          : "text-destructive cursor-not-allowed"
      )}
    >
      {domain || `${subdomain}.takeout-threads.app`}
      {domain && (
        isVerified ? 
          <CheckCircle className="inline h-3 w-3 ml-1" /> : 
          <AlertCircle className="inline h-3 w-3 ml-1" />
      )}
    </Link>
  )
} 