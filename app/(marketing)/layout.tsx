import Navigation from "@/components/navigation/Navigation"
import { Footer } from "@/components/navigation/Footer"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-blue-950">
        <Navigation />
      </header>
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

