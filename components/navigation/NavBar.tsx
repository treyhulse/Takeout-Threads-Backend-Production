/* components/NavBar.tsx */
"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/dashboard/ThemeToggle';



export function NavBar() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');


  return (
    <nav className="w-full">
      <div className="flex items-center justify-between w-full">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold">
            Takeout Threads
          </Link>

        </div>

        {/* Desktop Navigation - Hide in Dashboard */}
        {!isDashboard && (
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/designer" className="nav-link">
              Designer
            </Link>
            <Link href="/products" className="nav-link">
              Products
            </Link>
            <Link href="/dashboard" className="nav-link">
              Dashboard
            </Link>
          </div>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
        <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}