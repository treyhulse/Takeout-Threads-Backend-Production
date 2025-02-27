import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { ClipboardList, TrendingUp, Timer, Truck } from "lucide-react"

export const metadata: Metadata = {
  title: "Print Shop Order Management System | Takeout Threads",
  description: "Streamline your print shop's order processing with our comprehensive order management system. Track, process, and fulfill orders efficiently.",
  openGraph: {
    title: "Print Shop Order Management System | Takeout Threads",
    description: "Streamline your print shop's order processing with our comprehensive order management system. Track, process, and fulfill orders efficiently.",
  }
}

export default function OrderManagementPage() {
  const benefits = [
    {
      title: "Centralized Order Dashboard",
      description: "View and manage all orders from a single interface",
      icon: ClipboardList
    },
    {
      title: "Real-time Status Updates",
      description: "Track order progress through every stage of production",
      icon: TrendingUp
    },
    {
      title: "Automated Workflows",
      description: "Reduce manual tasks with automated order processing",
      icon: Timer
    },
    {
      title: "Shipping Integration",
      description: "Seamless integration with major shipping carriers",
      icon: Truck
    }
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-[800px] mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-6">
          Order Management System
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Take control of your order process from start to finish. Our order management system helps you track, process, and fulfill orders efficiently.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {benefits.map((benefit, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <benefit.icon className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">{benefit.title}</h2>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 