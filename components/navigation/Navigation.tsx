"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
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
              <div className="grid gap-3 bg-white p-6">
                <NavigationMenuLink asChild>
                  <Link href="/products" className="text-sm text-gray-700">
                    Product Item 1
                  </Link>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-white hover:bg-blue-950 hover:text-white data-[state=open]:bg-blue-950">
              Solutions
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 bg-white p-6">
                <NavigationMenuLink asChild>
                  <Link href="/solutions" className="text-sm text-gray-700">
                    Solution Item 1
                  </Link>
                </NavigationMenuLink>
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
              <div className="grid gap-3 bg-white p-6">
                <NavigationMenuLink asChild>
                  <Link href="/resources" className="text-sm text-gray-700">
                    Resource Item 1
                  </Link>
                </NavigationMenuLink>
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
