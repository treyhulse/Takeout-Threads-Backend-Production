"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { MediaLibrary } from "@/components/shared/MediaLibrary";
import { useState } from "react";
import Image from "next/image";
import { updateStore } from "@/lib/supabase/stores";
import { toast } from "sonner";

interface ViewWebsiteCardProps {
  storeName: string;
  subdomain: string;
  storeId: string;
  logoUrl?: string | null;
}

export function ViewWebsiteCard({ storeName, subdomain, storeId, logoUrl }: ViewWebsiteCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const storeUrl = `https://${subdomain}.treyhulse.com`;

  const handleLogoSelect = async (urls: string[]) => {
    if (urls.length === 0) return;
    
    try {
      const { error } = await updateStore(storeId, {
        store_logo_url: urls[0]
      });
      
      if (error) throw new Error(error);
      toast.success("Store logo updated successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to update store logo");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={storeName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full">
                    <Globe className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/50 transition-opacity"
                  onClick={() => setIsOpen(true)}
                >
                  <Upload className="h-4 w-4 text-white" />
                </Button>
              </div>
              
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">{storeName}</h2>
                <p className="text-sm text-muted-foreground">
                  Your store is live at{" "}
                  <span className="font-mono text-primary">{storeUrl}</span>
                </p>
              </div>
            </div>

            <Button 
              onClick={() => window.open(storeUrl, '_blank')}
              className="group"
            >
              View Website
              <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </Card>

      <MediaLibrary
        open={isOpen}
        onOpenChange={setIsOpen}
        onSelect={handleLogoSelect}
        multiple={false}
      />
    </motion.div>
  );
} 