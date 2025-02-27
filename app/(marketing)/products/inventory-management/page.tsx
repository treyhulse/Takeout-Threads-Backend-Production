import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Package, BarChart, Bell, RefreshCw } from "lucide-react"

export const metadata: Metadata = {
  title: "Print Shop Inventory Management System | Takeout Threads",
  description: "Take control of your print shop inventory with real-time tracking, automated reordering, and supplier integrations. Optimize your stock levels and reduce costs.",
  openGraph: {
    title: "Print Shop Inventory Management System | Takeout Threads",
    description: "Take control of your print shop inventory with real-time tracking, automated reordering, and supplier integrations. Optimize your stock levels and reduce costs.",
  }
}

export default function InventoryManagementPage() {
  const features = [
    {
      title: "Real-time Stock Tracking",
      description: "Monitor inventory levels across all locations in real-time",
      icon: Package
    },
    {
      title: "Analytics & Reporting",
      description: "Make data-driven decisions with comprehensive inventory reports",
      icon: BarChart
    },
    {
      title: "Low Stock Alerts",
      description: "Get notified automatically when inventory needs replenishing",
      icon: Bell
    },
    {
      title: "Supplier Integration",
      description: "Connect directly with suppliers for seamless reordering",
      icon: RefreshCw
    }
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-[800px] mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-6">
          Inventory Management System
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Keep track of your inventory with precision. Our system helps you maintain optimal stock levels,
          automate reordering, and reduce costs through efficient inventory management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <feature.icon className="h-8 w-8 text-primary" />
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