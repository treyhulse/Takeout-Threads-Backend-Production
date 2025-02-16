"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, PanelsTopLeft } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/dashboard/ThemeToggle"
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import {
  BarChart,
  Building2,
  Users,
  Newspaper,
  BookOpen,
  HeartHandshake,
  Building,
  GraduationCap,
  LineChart,
  BookMarked,
  Phone,
  FileText,
} from "lucide-react"

const solutions = [
  {
    title: "For Screen Printers",
    href: "/solutions/screen-printers",
    description: "Features tailored for bulk apparel production",
    icon: Building2,
  },
  {
    title: "For Embroiderers",
    href: "/solutions/embroiderers",
    description: "Workflow solutions for embroidery job fulfillment",
    icon: Building,
  },
  {
    title: "For Custom Brands",
    href: "/solutions/custom-brands",
    description: "White-label storefront & brand management tools",
    icon: LineChart,
  },
  {
    title: "For Wholesalers",
    href: "/solutions/wholesalers",
    description: "Supply chain integration and bulk purchasing",
    icon: Building2,
  },
  {
    title: "For Schools & Teams",
    href: "/solutions/schools-teams",
    description: "Satellite sites for fundraising & group orders",
    icon: GraduationCap,
  },
  {
    title: "For Corporate Merch",
    href: "/solutions/corporate",
    description: "Customizable company stores for internal ordering",
    icon: Building,
  },
]

const products = [
  {
    title: "Order Management",
    href: "/products/order-management",
    description: "Track, process, and fulfill customer orders",
    icon: FileText,
  },
  {
    title: "E-Commerce Store w/ Designer",
    href: "/products/website",
    description: "Customizable website with built-in design lab to streamline design and order processing",
    icon: PanelsTopLeft,
  },
  {
    title: "Product Catalog",
    href: "/products/catalog",
    description: "Manage product listings, pricing, and descriptions",
    icon: BookMarked,
  },
  {
    title: "Customer Management",
    href: "/products/customer-relationship-management",
    description: "CRM, follow-ups, and messaging tools",
    icon: Users,
  },
  {
    title: "Inventory Control",
    href: "/products/inventory-management",
    description: "Stock tracking and supplier integrations",
    icon: Building,
  },
  {
    title: "File Management",
    href: "/products/file-management",
    description: "Handle artwork, embroidery, and customer files",
    icon: FileText,
  },
]

const resources = [
  {
    title: "Help Center",
    href: "/resources/help",
    description: "Guides, FAQs, and support documentation",
    icon: BookOpen,
  },
  {
    title: "Webinars & Training",
    href: "/resources/webinars",
    description: "Live and recorded tutorials for users",
    icon: GraduationCap,
  },
  {
    title: "API Documentation",
    href: "/resources/api",
    description: "Developer resources for integrations",
    icon: FileText,
  },
  {
    title: "Case Studies & Testimonials",
    href: "/resources/case-studies",
    description: "Success stories from customers",
    icon: BookMarked,
  },
  {
    title: "Blog & Insights",
    href: "/resources/blog",
    description: "Industry trends, best practices, and product updates",
    icon: Newspaper,
  },
  {
    title: "Community Forum",
    href: "/resources/community",
    description: "A space for users to share insights and get help",
    icon: Users,
  },
]

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default function Navigation() {
  return (
    <div className="container flex h-16 items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logos/WhiteLogo-Text.png"
          alt="Ramp Logo"
          width={140}
          height={140}
        />
      </Link>

      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList className="gap-2">
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-white hover:bg-blue-950 hover:text-white data-[state=open]:bg-blue-950">
              Products
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[900px] p-6">
                <div className="grid grid-cols-4 gap-4">
                  {products.map((product) => (
                    <Link key={product.href} href={product.href} className="group block space-y-2 rounded-md p-4 hover:bg-accent">
                      <div className="flex items-center gap-3">
                        <product.icon className="h-5 w-5" />
                        <h3 className="font-medium">{product.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-white hover:bg-blue-950 hover:text-white data-[state=open]:bg-blue-950">
              Solutions
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[900px] p-6">
                <div className="grid grid-cols-4 gap-4">
                  {solutions.map((solution) => (
                    <Link key={solution.href} href={solution.href} className="group block space-y-2 rounded-md p-4 hover:bg-accent">
                      <div className="flex items-center gap-3">
                        <solution.icon className="h-5 w-5" />
                        <h3 className="font-medium">{solution.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{solution.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link
              href="/customers"
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-950 hover:text-white focus:bg-blue-950 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-blue-950 data-[state=open]:bg-blue-950"
            >
              Customers
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-white hover:bg-blue-950 hover:text-white data-[state=open]:bg-blue-950">
              Resources
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[800px] p-6">
                <div className="grid grid-cols-4 gap-4">
                  {resources.map((resource) => (
                    <Link key={resource.href} href={resource.href} className="group block space-y-2 rounded-md p-4 hover:bg-accent">
                      <div className="flex items-center gap-3">
                        <resource.icon className="h-5 w-5" />
                        <h3 className="font-medium">{resource.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link
              href="/pricing"
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-950 hover:text-white focus:bg-blue-950 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-blue-950 data-[state=open]:bg-blue-950"
            >
              Pricing
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link
              href="/dashboard"
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-950 hover:text-white focus:bg-blue-950 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-blue-950 data-[state=open]:bg-blue-950"
            >
              Dashboard
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="hidden md:flex md:gap-2">
          <LoginLink>
            <Button variant="secondary">Sign in</Button>
          </LoginLink>
          <RegisterLink>
            <Button>Sign up</Button>
          </RegisterLink>
        </div>

        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-4 py-4">
              <Link href="/products" className="text-sm">Products</Link>
              <Link href="/solutions" className="text-sm">Solutions</Link>
              <Link href="/customers" className="text-sm">Customers</Link>
              <Link href="/resources" className="text-sm">Resources</Link>
              <Link href="/pricing" className="text-sm">Pricing</Link>
              <Link href="/dashboard" className="text-sm">Dashboard</Link>
              <div className="md:hidden flex flex-col gap-2 pt-4">
                <LoginLink>
                  <Button variant="secondary" className="w-full">Sign in</Button>
                </LoginLink>
                <RegisterLink>
                  <Button className="w-full">Sign up</Button>
                </RegisterLink>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
