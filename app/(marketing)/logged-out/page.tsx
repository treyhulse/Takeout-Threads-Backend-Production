import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { LogIn } from 'lucide-react'

export default function LoggedOut() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto flex w-full max-w-[400px] flex-col justify-center space-y-6 p-4">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            You&apos;ve been logged out
          </h1>
          <p className="text-sm text-muted-foreground">
            Thanks for using our platform. Come back soon!
          </p>
        </div>

        <Link href="/api/auth/login" className="w-full">
          <Button className="w-full" size="lg">
            <LogIn className="mr-2 h-4 w-4" />
            Log back in
          </Button>
        </Link>

        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link 
            href="/" 
            className="hover:text-primary underline underline-offset-4"
          >
            Return to homepage
          </Link>
        </p>
      </div>
    </div>
  )
} 