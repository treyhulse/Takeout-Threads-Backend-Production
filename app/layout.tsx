import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/dashboard/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from './AuthProvider';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});


export const metadata: Metadata = {
  title: "Takeout Threads",
  description: "Takeout Threads - apparel customization platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
        <html lang="en" suppressHydrationWarning className={poppins.variable}>
          <body>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
    </AuthProvider>
  );
}
