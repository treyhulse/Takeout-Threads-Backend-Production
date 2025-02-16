import Link from "next/link";
import { ReactNode } from "react";
import LightLogo from "@/public/logos/BlackLogo-Text.png";
import DarkLogo from "@/public/logos/WhiteLogo-Text.png";
import Image from "next/image";
import { DashboardItems } from "@/components/dashboard/DashboardItems";
import { BadgeDollarSign, Calendar, ChartNoAxesCombined, CreditCard, File, Globe, ImageIcon, LayoutDashboard, MessageCircle, Shirt, Store, Truck, Unplug, User, Users } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";


export const navLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    name: "Items",
    href: "/dashboard/items",
    icon: Shirt,
  },
  {
    name: "Transactions",
    href: "/dashboard/transactions",
    icon: BadgeDollarSign,
  },
  {
    name: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    name: "Store",
    href: "/dashboard/stores",
    icon: Globe,
  },
  {
    name: "Shipping",
    href: "/dashboard/shipping",
    icon: Truck,
  },
  {
    name: "Messages",
    href: "/dashboard/messages",
    icon: MessageCircle,
  },
  {
    name: "Files",
    href: "/dashboard/files",
    icon: File,
  },
  {
    name: "Analytics & Reports",
    href: "/dashboard/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    name: "Integrations",
    href: "/dashboard/integrations",
    icon: Unplug,
  },
  {
    name: "Billing & Payments",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    name: "Organization",
    href: "/dashboard/organization",
    icon: Users,
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    name: "Marketplace",
    href: "/dashboard/marketplace",
    icon: Store,
  },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <section className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Image 
                src={LightLogo} 
                alt="Takeout Threads" 
                width={100}
                height={100}
                className="block dark:hidden"
              />
              <Image 
                src={DarkLogo} 
                alt="Takeout Threads" 
                width={100}
                height={100}
                className="hidden dark:block"
              />
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 font-medium lg:px-4">
              <DashboardItems />
            </nav>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </section>
  );
}