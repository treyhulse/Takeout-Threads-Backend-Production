"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Store } from "@/types/stores"
import { updateDomain, verifyDomain } from "@/lib/supabase/stores"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function DomainForm({ store }: { store: Store | null }) {
  const [domain, setDomain] = useState(store?.domain || "")
  const [isLoading, setIsLoading] = useState(false)

  if (!store) return null

  const handleUpdateDomain = async () => {
    setIsLoading(true)
    try {
      const { error } = await updateDomain(store.id, domain || null)
      if (error) throw new Error(error)
      toast.success("Domain updated successfully")
    } catch (error) {
      toast.error("Failed to update domain")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyDomain = async () => {
    setIsLoading(true)
    try {
      const { error } = await verifyDomain(store.id)
      if (error) throw new Error(error)
      toast.success("Domain verified successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to verify domain")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input 
          placeholder="yourdomain.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <Button 
          onClick={handleUpdateDomain}
          disabled={isLoading}
        >
          Update Domain
        </Button>
      </div>
      
      {store?.domain && !store.domain_verified && (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Add these DNS records to your domain to connect it to your store:
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Host</TableHead>
                <TableHead>Record Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>TTL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Required A Record */}
              <TableRow>
                <TableCell>@</TableCell>
                <TableCell>A</TableCell>
                <TableCell className="font-mono">76.76.21.21</TableCell>
                <TableCell>60</TableCell>
              </TableRow>
              {/* Recommended CNAME Record */}
              <TableRow>
                <TableCell>www</TableCell>
                <TableCell>CNAME</TableCell>
                <TableCell className="font-mono">cname.vercel-dns.com</TableCell>
                <TableCell>60</TableCell>
              </TableRow>
              {/* Domain Verification Record */}
              <TableRow>
                <TableCell>@</TableCell>
                <TableCell>TXT</TableCell>
                <TableCell className="font-mono">
                  takeout-threads-verify={store.verification_code}
                </TableCell>
                <TableCell>3600</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Button
            onClick={handleVerifyDomain}
            disabled={isLoading}
            variant="secondary"
          >
            Verify Domain
          </Button>
        </div>
      )}
    </div>
  )
} 