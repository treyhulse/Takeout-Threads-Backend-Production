import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getStore, updateDomain, verifyDomain } from "@/lib/supabase/stores"
import { CheckCircle2, XCircle, ChevronLeft } from "lucide-react"
import { DomainForm } from "@/components/stores/domain-form"
import { Store } from "@/types/stores"
import Link from "next/link"

export default async function DomainsPage({ params }: { params: { storeId: string } }) {
  const { data: storeData } = await getStore(params.storeId)
  const store = storeData as Store | null
  
  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link href={`/dashboard/stores/${params.storeId}`}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Store
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Custom Domain</CardTitle>
          <CardDescription>
            Connect your own domain to your store
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DomainForm store={store} />
          
          {store?.domain && (
            <Alert variant={store.domain_verified ? "default" : "destructive"}>
              <AlertTitle className="flex items-center gap-2">
                {store.domain_verified ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Domain Verified
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Domain Not Verified
                  </>
                )}
              </AlertTitle>
              <AlertDescription>
                {!store.domain_verified && (
                  <>
                    Add this TXT record to your domain&apos;s DNS settings to verify ownership:
                    <code className="block mt-2 p-2 bg-muted rounded-md">
                      takeout-threads-verify={store.verification_code}
                    </code>
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 