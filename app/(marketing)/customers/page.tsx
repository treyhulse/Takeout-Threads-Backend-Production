import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Customer Success Stories | Takeout Threads",
  description: "See how print shops are transforming their business with Takeout Threads. Real stories, real results from screen printers and custom apparel businesses.",
  openGraph: {
    title: "Customer Success Stories | Takeout Threads",
    description: "See how print shops are transforming their business with Takeout Threads. Real stories, real results from screen printers and custom apparel businesses.",
  }
}

export default function CustomersPage() {
  const customers = [
    {
      name: "Custom Ink Prints",
      quote: "Takeout Threads helped us increase our order processing speed by 300%",
      industry: "Screen Printing",
      image: "/logos/BB.png"
    },
    {
      name: "Nike Custom",
      quote: "The design lab integration revolutionized how we handle custom orders",
      industry: "Athletic Apparel",
      image: "/logos/nike.jpg"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-[800px] mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-4">
          Success Stories
        </h1>
        <p className="text-xl text-muted-foreground">
          Join hundreds of print shops that trust Takeout Threads to power their business
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {customers.map((customer, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16">
                  <Image
                    src={customer.image}
                    alt={customer.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{customer.name}</h2>
                  <p className="text-muted-foreground">{customer.industry}</p>
                </div>
              </div>
              <blockquote className="text-lg italic">&quot;{customer.quote}&quot;</blockquote>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

  