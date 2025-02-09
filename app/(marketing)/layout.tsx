import Navigation from "@/components/navigation/Navigation"
import { Footer } from "@/components/navigation/Footer"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center px-4 lg:px-8 bg-blue-950">
        <Navigation />
      </header>
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

