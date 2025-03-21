"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaLibrary } from "@/components/shared/MediaLibrary";
import { Item, ItemImage } from "@/types/items";
import { updateItem } from "@/lib/supabase/items";
import { toast } from "sonner";
import Image from "next/image";
import { ImageIcon, X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

interface ItemImagesProps {
  item: Item;
  onUpdate?: (item: Item) => void;
}

function sanitizeUrl(url: string) {
  return url.trim()
    .replace(/[\r\n]+/g, '')
    .replace(/%0A/g, '')
    .replace(/%20/g, ' ');
}

function SortableImage({ image, index, onRemove }: { 
  image: ItemImage; 
  index: number;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: image.url });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  // Sanitize the image URL
  const sanitizedUrl = sanitizeUrl(image.url);

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative aspect-square overflow-hidden rounded-lg border bg-muted/10",
        "w-full"
      )}
    >
      <div 
        className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 cursor-grab"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-black" />
      </div>
      {index <= 1 && (
        <div className="absolute top-2 left-8 z-10 bg-black/40 px-2 py-1 rounded text-xs text-white">
          {index === 0 ? 'Front' : 'Back'}
        </div>
      )}
      <Image
        src={sanitizedUrl}
        alt={image.name}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 20vw, 16vw"
        loading="lazy"
        onError={(e) => {
          console.error('Image failed to load:', sanitizedUrl);
          // Optionally set a fallback image
        }}
      />
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-black hover:text-red-500"
          onClick={onRemove}
        >
          <X className="h-4 w-4 text-black" />
        </Button>
      </div>
    </div>
  );
}

export function ItemImages({ item, onUpdate }: ItemImagesProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = item.images?.findIndex(img => img.url === active.id);
      const newIndex = item.images?.findIndex(img => img.url === over.id);
      
      if (oldIndex !== undefined && newIndex !== undefined && item.images) {
        const newImages = arrayMove(item.images, oldIndex, newIndex);
        const updates: Partial<Item> = {
          images: newImages,
          front_image_url: newImages[0]?.url,
          back_image_url: newImages[1]?.url,
        };

        try {
          const { data, error } = await updateItem(item.id, updates);
          if (error) throw error;
          if (data) {
            onUpdate?.(data as unknown as Item);
            toast.success("Image order updated");
          }
        } catch (error) {
          toast.error("Failed to update image order");
        }
      }
    }
  };

  const handleImagesSelected = async (selectedUrls: string[]) => {
    try {
      // Sanitize URLs before converting to ItemImage objects
      const sanitizedUrls = selectedUrls.map(url => 
        url.trim()
           .replace(/[\r\n]+/g, '')
           // Ensure proper URL encoding
           .replace(/%0A/g, '')
           .replace(/%20/g, ' ')
      );

      // Convert URLs to ItemImage objects
      const newImages: ItemImage[] = sanitizedUrls.map(url => ({
        url,
        name: url.split('/').pop() || '',
        size: 0, // We don't have this info from the URL
        type: 'image/*', // We don't have this info from the URL
        uploadedAt: new Date(),
      }));

      // Combine existing images with new images
      const combinedImages = [...(item.images || []), ...newImages];

      // Update the item with combined images
      const { data, error } = await updateItem(item.id, {
        images: combinedImages,
        // Set the front image only if it's not already set
        ...((!item.front_image_url && newImages.length > 0) && {
          front_image_url: newImages[0].url
        })
      });

      if (error) throw new Error(error);
      if (data) {
        onUpdate?.(data as unknown as Item);
        toast.success("Images added successfully");
      }
    } catch (error) {
      console.error('Error updating images:', error);
      toast.error("Failed to update images");
    } finally {
      setIsSelecting(false);
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    try {
      // Sanitize the URL before comparison
      const sanitizedUrl = sanitizeUrl(imageUrl);

      const updatedImages = item.images?.filter(img => {
        const imgUrl = sanitizeUrl(img.url);
        return imgUrl !== sanitizedUrl;
      }) || [];

      const updates: Partial<Item> = {
        images: updatedImages,
      };

      // If we're removing the front image, update that as well
      if (item.front_image_url === imageUrl) {
        updates.front_image_url = updatedImages[0]?.url || undefined;
      }

      const { data, error } = await updateItem(item.id, updates);
      if (error) throw new Error(error);
      if (data) {
        onUpdate?.(data as unknown as Item);
        toast.success("Image removed successfully");
      }
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error("Failed to remove image");
    }
  };

  const setAsFrontImage = async (imageUrl: string) => {
    try {
      // Sanitize the URL before saving
      const sanitizedUrl = sanitizeUrl(imageUrl);

      const { data, error } = await updateItem(item.id, {
        front_image_url: sanitizedUrl
      });
      if (error) throw new Error(error);
      if (data) {
        onUpdate?.(data as unknown as Item);
        toast.success("Front image updated");
      }
    } catch (error) {
      console.error('Error updating front image:', error);
      toast.error("Failed to update front image");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Images</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsSelecting(true)}
          className="gap-2"
        >
          <ImageIcon className="h-4 w-4" />
          Add Images
        </Button>
        <MediaLibrary
          open={isSelecting}
          onOpenChange={setIsSelecting}
          onSelect={handleImagesSelected}
          multiple
        />
      </CardHeader>
      <CardContent>
        {item.images && item.images.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={item.images.map(img => img.url)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-5 gap-4 max-w-[800px]">
                {item.images.map((image, index) => (
                  <SortableImage
                    key={image.url}
                    image={image}
                    index={index}
                    onRemove={() => handleRemoveImage(image.url)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg bg-muted/10 max-w-[800px]">
            <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-sm">No images yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 