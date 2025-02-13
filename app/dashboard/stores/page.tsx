import { getStores } from "@/lib/supabase/stores"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Globe, Pencil, Layout, Palette, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { StoreModal } from "@/components/stores/store-modal"
import { cn } from "@/lib/utils"
import { DomainLink } from "@/components/stores/domain-link"

export default async function SitesPage() {
  const { data: stores, error } = await getStores()

  if (error) {
    return (
      <div className="container py-6">
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold tracking-tight">My Sites</h1>
        <StoreModal />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stores?.map((store) => (
          <Link href={`/dashboard/stores/${store.id}`} key={store.id}>
            <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  {store.store_logo_url && (
                    <div className="h-12 w-12 relative rounded-full overflow-hidden">
                      <Image
                        src={store.store_logo_url}
                        alt={store.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <CardTitle className="flex items-center justify-between">
                      {store.name}
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                    <CardDescription>{store.slogan}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="relative w-full h-32 bg-muted rounded-md overflow-hidden">
                  <Image
                    src={`https://api.microlink.io?url=https://${store.subdomain}.takeout-threads.app&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1280&viewport.height=800&screenshot.scroll=false&screenshot.element=header`}
                    alt={`Preview of ${store.name}`}
                    fill
                    className="object-cover object-top"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">Domain</span>
                    </div>
                    <div className="space-y-1">
                      {store.domain && (
                        <DomainLink 
                          domain={store.domain}
                          subdomain={store.subdomain}
                          isVerified={store.domain_verified}
                        />
                      )}
                      <Link 
                        href={`https://${store.subdomain}.takeout-threads.app`}
                        target="_blank"
                        className="text-sm text-muted-foreground hover:underline block truncate"
                      >
                        {store.subdomain}.takeout-threads.app
                      </Link>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Palette className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">Theme</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {store.theme?.name || "Default"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Layout className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Pages</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {store.pages?.map((page) => (
                      <Badge key={page.id} variant="outline">
                        {page.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
} 