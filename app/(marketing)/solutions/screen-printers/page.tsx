import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Screen Printing Solutions | Takeout Threads",
  description: "Purpose-built tools for screen printing businesses. Manage orders, track inventory, and streamline your production workflow with our comprehensive platform.",
  openGraph: {
    title: "Screen Printing Solutions | Takeout Threads",
    description: "Purpose-built tools for screen printing businesses. Manage orders, track inventory, and streamline your production workflow with our comprehensive platform.",
  }
}

export default function ScreenPrintersPage() {
  const features = [
    {
      title: "Bulk Order Management",
      description: "Handle large orders with ease, from quote to delivery"
    },
    {
      title: "Production Scheduling",
      description: "Optimize your print queue and track job status in real-time"
    },
    {
      title: "Ink Management",
      description: "Track ink usage and automate reordering"
    },
    {
      title: "Screen Library",
      description: "Digital catalog of all your screens with usage history"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-[800px] mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-6">
          Built for Screen Printers
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Streamline your screen printing operation with tools designed specifically for high-volume production environments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="border-2">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 