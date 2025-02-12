// components/shared/MediaLibrary.tsx
"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadImage, getImages, deleteImages } from "@/lib/supabase/storage";
import Image from "next/image";
import { Upload, ImageIcon, Loader2, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CopyButton } from "@/components/CopyButton";

type UploadingFile = {
  id: string;
  file: File;
  progress: number;
  error?: string;
};

interface MediaLibraryProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (urls: string[]) => void;
  multiple?: boolean;
}

export function MediaLibrary({ 
  open, 
  onOpenChange, 
  onSelect,
  multiple = false 
}: MediaLibraryProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const imageUrls = await getImages();
      setImages(imageUrls);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchImages();
    } else {
      setSelectedImages(new Set());
    }
  }, [open]);

  const handleDeleteSelected = async () => {
    if (selectedImages.size === 0) return;
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteImages(Array.from(selectedImages));
      await fetchImages();
      setSelectedImages(new Set());
      toast.success(`Deleted ${selectedImages.size} image${selectedImages.size > 1 ? 's' : ''}`);
    } catch (err) {
      console.error('Error deleting images:', err);
      toast.error("Failed to delete images");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const toggleImageSelection = (url: string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(url)) {
        newSet.delete(url);
      } else {
        newSet.add(url);
      }
      return newSet;
    });
  };

  const processFiles = async (files: FileList) => {
    const newFiles = Array.from(files).slice(0, 5); // Limit to 5 files

    if (newFiles.length > 5) {
      toast.error("Maximum 5 files can be uploaded at once");
      return;
    }

    const invalidFiles = newFiles.filter(
      file => !file.type.startsWith('image/') || file.size > 10 * 1024 * 1024
    );

    if (invalidFiles.length > 0) {
      toast.error("Some files were invalid. Please ensure all files are images under 10MB.");
      return;
    }

    // Create uploading file entries
    const uploadingEntries = newFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0
    }));

    setUploadingFiles(prev => [...prev, ...uploadingEntries]);

    // Process each file
    await Promise.all(
      uploadingEntries.map(async (entry) => {
        const formData = new FormData();
        formData.append("file", entry.file);

        try {
          await uploadImage(formData);
          setUploadingFiles(prev => 
            prev.filter(f => f.id !== entry.id)
          );
        } catch (err) {
          setUploadingFiles(prev => 
            prev.map(f => 
              f.id === entry.id 
                ? { ...f, error: "Upload failed" }
                : f
            )
          );
          console.error(err);
        }
      })
    );

    // Refresh the image list
    await fetchImages();
    router.refresh();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(Array.from(selectedImages));
      setSelectedImages(new Set());
      onOpenChange?.(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Upload size={16} />
            Media Library
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Media Library</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div
              className={cn(
                "relative border-2 border-dashed rounded-lg p-8 transition-all",
                "hover:bg-muted/50 cursor-pointer",
                isDragging && "border-primary bg-muted/50",
                "flex flex-col items-center justify-center gap-4"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-8 h-8 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Drag and drop up to 5 images, or click to select
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </div>
              <input
                type="file"
                name="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {/* Uploading Files Progress */}
            {uploadingFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadingFiles.map((file) => (
                  <div 
                    key={file.id}
                    className="relative aspect-square overflow-hidden rounded-lg border bg-muted/10"
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <p className="text-xs text-muted-foreground px-2 text-center truncate max-w-[90%]">
                        {file.file.name}
                      </p>
                    </div>
                    {file.error && (
                      <div className="absolute inset-0 bg-destructive/10 flex items-center justify-center">
                        <p className="text-xs text-destructive text-center px-2">
                          {file.error}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {error && (
              <p className="text-destructive text-sm bg-destructive/10 p-2 rounded">
                {error}
              </p>
            )}

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Your Images</h3>
                {selectedImages.size > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteSelected}
                    disabled={isDeleting}
                    className="gap-2 text-muted-foreground hover:text-destructive hover:border-destructive"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Delete {selectedImages.size} selected
                  </Button>
                )}
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square rounded-lg bg-muted/10 animate-pulse" />
                  ))}
                </div>
              ) : images.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg bg-muted/10">
                  <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground text-sm">No images found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((url) => (
                    <div 
                      key={url} 
                      className={cn(
                        "group relative aspect-square overflow-hidden border",
                        "bg-muted/10 transition-all",
                        selectedImages.has(url) && "ring-1 ring-black/50"
                      )}
                      onClick={() => toggleImageSelection(url)}
                    >
                      <div className="absolute top-2 right-2 z-10">
                        <Checkbox
                          checked={selectedImages.has(url)}
                          onCheckedChange={() => toggleImageSelection(url)}
                          className={cn(
                            "h-[18px] w-[18px] rounded-sm",
                            "border-transparent bg-black/20 hover:bg-black/40",
                            "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
                            "transition-all"
                          )}
                        />
                      </div>
                      <Image
                        src={url}
                        alt="Uploaded image"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        loading="lazy"
                      />
                      <div 
                        className="absolute bottom-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()} // Prevent selection toggle
                      >
                        <CopyButton 
                          value={url}
                          className={cn(
                            "bg-black/20 hover:bg-black/40",
                            "text-white hover:text-white",
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add select button when in selection mode */}
            {onSelect && selectedImages.size > 0 && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedImages(new Set())}>
                  Cancel
                </Button>
                <Button onClick={handleSelect}>
                  Select {selectedImages.size} image{selectedImages.size > 1 ? 's' : ''}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedImages.size} selected image{selectedImages.size > 1 ? 's' : ''}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
