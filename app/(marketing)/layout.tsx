import Navigation from "@/components/navigation/Navigation"
import { Footer } from "@/components/navigation/Footer"
import Script from 'next/script'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Takeout Threads",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "The ultimate apparel customization platform for print shops. Streamline your operations and grow your business.",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "50"
            },
            "featureList": [
              "Custom Website Builder",
              "Design Lab",
              "Order Management",
              "Inventory Control",
              "Multi-brand Support"
            ]
          })
        }}
      />
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-blue-950">
          <Navigation />
        </header>
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}

