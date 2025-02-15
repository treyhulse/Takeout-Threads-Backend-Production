import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function MarketplaceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="container mx-auto py-6 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
                <div className="flex items-center gap-4">
                    <Link 
                        href="/marketplace/cart" 
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                        Cart
                    </Link>
                </div>
            </div>
            
            <Tabs defaultValue="browse" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="browse" asChild>
                        <Link href="/marketplace">Browse</Link>
                    </TabsTrigger>
                    <TabsTrigger value="orders" asChild>
                        <Link href="/marketplace/orders">Orders</Link>
                    </TabsTrigger>
                    <TabsTrigger value="vendors" asChild>
                        <Link href="/marketplace/vendors">Vendors</Link>
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <main>{children}</main>
        </div>
    )
}
