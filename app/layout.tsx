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
  title: {
    default: "Takeout Threads",
    template: "%s | Takeout Threads"
  },
  description: "Takeout Threads - The ultimate apparel customization platform for print shops. Streamline your operations and grow your business.",
  keywords: ["apparel customization", "print shop", "custom clothing", "print on demand", "apparel printing"],
  authors: [{ name: "Takeout Threads" }],
  creator: "Takeout Threads",
  publisher: "Takeout Threads",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://takeout-threads.com",
    siteName: "Takeout Threads",
    title: "Takeout Threads",
    description: "Takeout Threads - The ultimate apparel customization platform for print shops. Streamline your operations and grow your business.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Takeout Threads"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Takeout Threads",
    description: "Takeout Threads - The ultimate apparel customization platform for print shops. Streamline your operations and grow your business.",
    images: ["/og-image.jpg"],
    creator: "@takeoutthreads"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "google-site-verification=q4_BOUC2-47-bIN_rgMggxq-5BB025xHW0audUweIYo",
  },
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
