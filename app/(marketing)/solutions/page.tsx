import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Print Shop Solutions & Features | Takeout Threads",
  description: "Explore our comprehensive print shop solutions. From custom brand management to order processing, discover how we can help streamline your print shop operations.",
  openGraph: {
    title: "Print Shop Solutions & Features | Takeout Threads",
    description: "Explore our comprehensive print shop solutions. From custom brand management to order processing, discover how we can help streamline your print shop operations.",
  }
}

export default function SolutionsPage() {
  const solutions = [
    {
      title: "Custom Brands",
      description: "Create and manage multiple brands with unique storefronts",
      href: "/solutions/custom-brands"
    },
    {
      title: "Order Processing",
      description: "Streamline your order workflow from design to delivery",
      href: "/solutions/order-processing"
    },
    {
      title: "Design Lab",
      description: "Powerful design tools for your customers and team",
      href: "/solutions/design-lab"
    },
    {
      title: "Integration",
      description: "Connect with your favorite tools and services",
      href: "/solutions/integration"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-6">
        Solutions for Modern Print Shops
      </h1>
      <p className="text-xl text-muted-foreground mb-12 max-w-[800px]">
        Discover how our platform can transform your print shop operations and help you grow your business.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {solutions.map((solution) => (
          <Link href={solution.href} key={solution.href}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">{solution.title}</h2>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">{solution.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

  