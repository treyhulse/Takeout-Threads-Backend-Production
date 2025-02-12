// components/shared/MediaLibraryImages.server.tsx
import { getImages } from "@/lib/supabase/storage";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

export default async function MediaLibraryImages() {
  try {
    const imageUrls = await getImages();

    if (!imageUrls || imageUrls.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg bg-muted/10">
          <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground text-sm">No images found</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {imageUrls.map((url) => (
          <div 
            key={url} 
            className="group relative aspect-square overflow-hidden rounded-lg border bg-muted/10"
          >
            <Image
              src={url}
              alt="Uploaded image"
              fill
              className="object-cover transition-all hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              loading="lazy"
              onError={(e) => {
                console.error(`Failed to load image: ${url}`);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(url);
                }}
                className="text-xs bg-black/50 text-white px-3 py-1 rounded-full hover:bg-black/70 transition-colors"
              >
                Copy URL
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error('Error in MediaLibraryImages:', error);
    return (
      <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
        <p className="text-sm font-medium">Error loading images</p>
        <p className="text-xs mt-1">Please try refreshing the page</p>
      </div>
    );
  }
}
