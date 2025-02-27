import { Button } from "@/components/ui/button";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Hero } from "@/components/frontend/Hero";
import { Logos } from "@/components/frontend/Logos";
import { Features } from "@/components/frontend/Features";
import { redirect } from "next/navigation";
import { SocialProof } from "@/components/frontend/SocialProof";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Takeout Threads - Ultimate Apparel Print Shop Platform",
  description: "Transform your print shop operations with Takeout Threads. Streamline your workflow, manage orders efficiently, and grow your business with our comprehensive platform.",
  openGraph: {
    title: "Takeout Threads - Ultimate Apparel Print Shop Platform",
    description: "Transform your print shop operations with Takeout Threads. Streamline your workflow, manage orders efficiently, and grow your business with our comprehensive platform.",
  }
};

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const session = await getUser();

  if (session?.id) {
    return redirect("/dashboard");
  }

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Takeout Threads",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "description": "Ultimate apparel print shop platform for managing operations and growing your business",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "1000"
            }
          })
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <Hero />
        <Logos />
        <Features />
        <SocialProof />
      </div>
    </>
  );
}
