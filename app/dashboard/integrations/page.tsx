import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle2, Plus, Store } from "lucide-react"

export default function IntegrationsPage() {
  const integrations = [
    {
      name: "Shopify",
      description: "Connect your Shopify store to sync products and orders",
      status: "connected",
      icon: Store,
    },
    {
      name: "S&S Activewear",
      description: "Sync inventory and automate purchase orders",
      status: "available",
      icon: Store,
    },
    {
      name: "QuickBooks by Intuit",
      description: "Accounting software for managing your business finances",
      status: "available",
      icon: Store,
    },
    {
      name: "PirateShip",
      description: "Automate shipping label generation and tracking",
      status: "available",
      icon: Store,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">Connect your favorite platforms and services</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Integration
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <Card key={integration.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">{integration.name}</CardTitle>
              <integration.icon className="h-6 w-6" />
            </CardHeader>
            <CardContent>
              <CardDescription>{integration.description}</CardDescription>
              <div className="mt-4 flex items-center justify-between">
                {integration.status === "connected" ? (
                  <Badge variant="default" className="bg-blue-950 text-white">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="secondary">Available</Badge>
                )}
                <Button variant="ghost" size="sm">
                  Configure
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

