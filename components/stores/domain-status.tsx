'use client'

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableHeader, TableBody, TableCell, TableRow, TableHead } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, CheckCircle, AlertCircle } from "lucide-react"
import { verifyDomainOnVercel } from "@/lib/vercel/actions/domains"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function DomainStatus({ store }: { store: any }) {
  const { toast } = useToast()

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="text-sm font-medium">Custom Domain</div>
        <div className="space-y-2">
          {store.domain ? (
            <>
              <div className="flex items-center gap-4">
                <Link 
                  href={`https://${store.domain}`} 
                  target="_blank"
                  className={cn(
                    "hover:underline flex items-center gap-2",
                    store.domain_verified ? "text-green-500" : "text-red-500"
                  )}
                >
                  {store.domain}
                  <ExternalLink className="h-4 w-4" />
                </Link>
                
                {!store.domain_verified && (
                  <Button 
                    variant="secondary"
                    size="sm"
                    onClick={async () => {
                      try {
                        if (!store.domain) throw new Error("No domain configured")
                        await verifyDomainOnVercel(store.domain)
                        toast({
                          title: "Success",
                          description: "Domain verified successfully",
                        })
                        window.location.reload()
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to verify domain",
                          variant: "destructive",
                        })
                      }
                    }}
                  >
                    Verify Domain
                  </Button>
                )}
              </div>

              <Alert variant={store.domain_verified ? "default" : "destructive"}>
                <div className="flex items-center gap-2">
                  {store.domain_verified ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <AlertDescription>Domain verified and active</AlertDescription>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>Domain needs verification - Add these DNS records:</AlertDescription>
                    </>
                  )}
                </div>
              </Alert>
            </>
          ) : (
            <div className="text-muted-foreground">No custom domain set</div>
          )}
        </div>
      </div>
      {/* ... rest of your domain status JSX ... */}
    </div>
  )
} 