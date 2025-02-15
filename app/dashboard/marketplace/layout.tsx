import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"

export default async function MarketplaceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) {
        redirect("/dashboard")
    }

    return (
        <div className="container mx-auto py-6 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
                <div className="flex items-center gap-4">
                    <Link 
                        href="/dashboard/marketplace/cart" 
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                        Cart
                    </Link>
                </div>
            </div>
            
            <Tabs defaultValue="browse" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="browse" asChild>
                        <Link href="/dashboard/marketplace">Browse</Link>
                    </TabsTrigger>
                    <TabsTrigger value="orders" asChild>
                        <Link href="/dashboard/marketplace/orders">Orders</Link>
                    </TabsTrigger>
                    <TabsTrigger value="vendors" asChild>
                        <Link href="/dashboard/marketplace/vendors">Vendors</Link>
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <main>{children}</main>
        </div>
    )
}
