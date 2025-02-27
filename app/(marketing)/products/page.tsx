import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Print Shop Products & Solutions | Takeout Threads",
  description: "Discover our comprehensive suite of print shop management tools. From design labs to order management, we have everything you need to streamline your operations.",
  openGraph: {
    title: "Print Shop Products & Solutions | Takeout Threads",
    description: "Discover our comprehensive suite of print shop management tools. From design labs to order management, we have everything you need to streamline your operations.",
  }
}

export default function ProductsPage() {
  const products = [
    {
      title: "Website with Design Lab",
      description: "Custom website with integrated design tools for your print shop",
      href: "/products/website"
    },
    {
      title: "Order Management",
      description: "Streamline your order processing and fulfillment workflow",
      href: "/products/order-management"
    },
    {
      title: "Inventory Control",
      description: "Track and manage your inventory in real-time",
      href: "/products/inventory"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-6">Print Shop Solutions</h1>
      <p className="text-xl text-muted-foreground mb-12 max-w-[800px]">
        Everything you need to run your print shop efficiently. Our tools are designed specifically for print shop owners.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link href={product.href} key={product.href}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-2">{product.title}</h2>
                <p className="text-muted-foreground">{product.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

  