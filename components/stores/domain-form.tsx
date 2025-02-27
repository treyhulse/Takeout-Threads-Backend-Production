"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Store } from "@/types/stores"
import { updateDomain, verifyDomain } from "@/lib/vercel/actions/domains"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

export function DomainForm({ store }: { store: Store }) {
  const [domain, setDomain] = useState(store?.domain || "")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleUpdateDomain = async () => {
    setIsLoading(true)
    try {
      const cleanDomain = domain.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '')
      const { error } = await updateDomain(store.id, cleanDomain || null)
      if (error) throw new Error(error)
      
      toast({
        title: "Domain Updated",
        description: "Please add the DNS records below to verify your domain",
      })
      window.location.reload()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update domain",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyDomain = async () => {
    setIsLoading(true)
    try {
      const { error } = await verifyDomain(store.id)
      if (error) throw new Error(error)
      
      toast({
        title: "Success",
        description: "Domain verified and configured with Vercel",
      })
      window.location.reload()
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message
        : "Failed to verify domain"
      
      toast({
        title: "Verification Failed",
        description: errorMessage.includes('already in use by one of your projects')
          ? "Domain is already configured with this project. Proceeding with verification."
          : errorMessage,
        variant: errorMessage.includes('already in use by one of your projects') ? "default" : "destructive",
      })

      // If the error is that the domain is already in use, we should still reload
      // as this is actually a success case
      if (errorMessage.includes('already in use by one of your projects')) {
        window.location.reload()
      }
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
          {store.domain ? "Update Domain" : "Add Domain"}
        </Button>
      </div>
      
      {store.domain && (
        <Alert variant={store.domain_verified ? "default" : "destructive"}>
          <div className="flex items-center gap-2">
            {store.domain_verified ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {store.domain_verified 
                ? "Domain is verified and active" 
                : "Domain needs verification - Add these DNS records:"}
            </AlertDescription>
          </div>
        </Alert>
      )}
      
      {store.domain && !store.domain_verified && (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>A</TableCell>
                <TableCell>@</TableCell>
                <TableCell className="font-mono">76.76.21.21</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>TXT</TableCell>
                <TableCell>@</TableCell>
                <TableCell className="font-mono break-all">
                  takeout-threads-verify={store.verification_code}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Button
            onClick={handleVerifyDomain}
            disabled={isLoading}
            className="w-full"
          >
            Verify DNS Configuration
          </Button>
        </div>
      )}
    </div>
  )
} 