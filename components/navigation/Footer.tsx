import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "../dashboard/ThemeToggle"

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="space-y-4">
          <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image 
                    src="/logos/BlackLogo-Text.png" 
                    alt="Takeout Threads" 
                    width={150} 
                    height={150}
                />
              </Link>
            </div>
            <p className="text-sm text-gray-500">Empowering print shops with modern apparel customization solutions</p>
            <ThemeToggle />
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-blue-950">Product</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/features">Features</Link>
              </li>
              <li>
                <Link href="/pricing">Pricing</Link>
              </li>
              <li>
                <Link href="/integrations">Integrations</Link>
              </li>
              <li>
                <Link href="/enterprise">Enterprise</Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-blue-950">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/customers">Customers</Link>
              </li>
              <li>
                <Link href="/careers">Careers</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-blue-950">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/guides">Guides</Link>
              </li>
              <li>
                <Link href="/documentation">Documentation</Link>
              </li>
              <li>
                <Link href="/support">Support</Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-blue-950">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
              <li>
                <Link href="/terms">Terms</Link>
              </li>
              <li>
                <Link href="/security">Security</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Takeout Threads. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

