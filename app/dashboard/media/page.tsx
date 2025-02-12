// app/dashboard/media/page.tsx
"use client";

import { useState } from "react";
import { MediaLibrary } from "@/components/shared/MediaLibrary";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

export default function MediaPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsOpen(true)}
          className="gap-2"
        >
          <ImageIcon className="h-4 w-4" />
          Upload Images
        </Button>
      </div>

      <MediaLibrary
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </div>
  );
}
