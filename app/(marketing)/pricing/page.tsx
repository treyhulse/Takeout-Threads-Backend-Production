import { Metadata } from "next"
import PricingTable from "@/components/PricingTable"

export const metadata: Metadata = {
  title: "Pricing Plans for Print Shops | Takeout Threads",
  description: "Affordable pricing plans for print shops of all sizes. Start with our free trial and scale as you grow. No hidden fees, cancel anytime.",
  openGraph: {
    title: "Pricing Plans for Print Shops | Takeout Threads",
    description: "Affordable pricing plans for print shops of all sizes. Start with our free trial and scale as you grow. No hidden fees, cancel anytime.",
  }
}

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-[800px] mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-muted-foreground">
          Choose the perfect plan for your print shop. All plans include our core features.
          Start with a free trial and upgrade as you grow.
        </p>
      </div>
      <PricingTable />
    </div>
  )
}
