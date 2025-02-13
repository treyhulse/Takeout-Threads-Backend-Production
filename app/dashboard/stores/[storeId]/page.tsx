import { notFound } from "next/navigation"
import { getStore } from "@/lib/supabase/stores"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Globe, ChevronLeft, Palette, Layout, Edit, Upload } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { CreatePageModal } from "@/components/modals/create-page-modal"
import { CreateComponentModal } from "@/components/modals/create-component-modal"
import { MediaLibrary } from "@/components/shared/MediaLibrary"
import { updateStore } from "@/lib/supabase/stores"

interface StorePageProps {
  params: {
    storeId: string
  }
}

export default async function StorePage({ params }: StorePageProps) {
  const { data: store, error } = await getStore(params.storeId)

  if (error || !store) {
    notFound()
  }

  return (
    <div className="p-6 space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/dashboard/stores">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Stores
        </Link>
      </Button>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {store.store_logo_url ? (
            <div className="relative h-12 w-12">
              <div className="h-full w-full rounded-full overflow-hidden">
                <Image
                  src={store.store_logo_url}
                  alt={store.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1">
                <MediaLibrary
                  onSelect={async (urls) => {
                    'use server'
                    if (urls.length > 0) {
                      await updateStore(store.id, {
                        store_logo_url: urls[0]
                      })
                    }
                  }}
                >
                  <Button 
                    size="icon" 
                    className="h-5 w-5 rounded-full"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </MediaLibrary>
              </div>
            </div>
          ) : (
            <div className="relative h-12 w-12">
              <div className="h-full w-full rounded-full bg-muted flex items-center justify-center">
                <span className="text-xl font-semibold text-muted-foreground">
                  {store.name.charAt(0)}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1">
                <MediaLibrary
                  onSelect={async (urls) => {
                    'use server'
                    if (urls.length > 0) {
                      await updateStore(store.id, {
                        store_logo_url: urls[0]
                      })
                    }
                  }}
                >
                  <Button 
                    size="icon" 
                    className="h-5 w-5 rounded-full"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </MediaLibrary>
              </div>
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{store.name}</h1>
            <p className="text-muted-foreground">{store.slogan}</p>
          </div>
        </div>
        <Button variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Edit Store
        </Button>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Domain Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Custom Domain</div>
                  <div className="text-muted-foreground">
                    {store.domain ? (
                      <Link 
                        href={`https://${store.domain}`} 
                        target="_blank"
                        className="hover:underline text-primary"
                      >
                        {store.domain}
                      </Link>
                    ) : 'No custom domain set'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Subdomain</div>
                  <div className="text-muted-foreground">
                    <Link 
                      href={`https://${store.subdomain}.takeout-threads.app`} 
                      target="_blank"
                      className="hover:underline text-primary"
                    >
                      {store.subdomain}.takeout-threads.app
                    </Link>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium">Timezone</div>
                <div className="text-muted-foreground">{store.timezone}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Theme Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Current Theme</div>
                  <Badge variant="secondary" className="mt-1">
                    {store.theme?.name}
                  </Badge>
                </div>
                {store.theme?.metadata && (
                  <div>
                    <div className="text-sm font-medium">Font</div>
                    <div className="text-muted-foreground">
                      {(store.theme?.metadata as { font: string })?.font}
                    </div>
                  </div>
                )}
              </div>
              {store.theme?.metadata && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm font-medium mb-2">Colors</div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Primary:</span>
                        <div 
                          className="w-6 h-6 rounded-full" 
                          style={{ backgroundColor: (store.theme?.metadata as { primaryColor: string })?.primaryColor }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Secondary:</span>
                        <div 
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: (store.theme?.metadata as { secondaryColor: string })?.secondaryColor }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Store Pages</CardTitle>
              <div className="flex items-center gap-2">
                <CreateComponentModal orgId={store.org_id} />
                <CreatePageModal storeId={store.id} orgId={store.org_id} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {store.pages?.map((page) => (
                  <Link 
                    key={page.id} 
                    href={`/dashboard/stores/${store.id}/pages/${page.id}`}
                    className="block hover:opacity-70 transition-opacity"
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">{page.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {(page.metadata as { layout: Array<{ type: string }> })?.layout?.map((item, index) => (
                            <Badge key={index} variant="outline">
                              {item.type}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 