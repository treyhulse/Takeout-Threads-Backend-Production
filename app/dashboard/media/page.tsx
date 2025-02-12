// app/dashboard/media/page.tsx
import MediaLibrary from "@/components/shared/MediaLibrary";

export default function MediaPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Media Library</h1>
      <MediaLibrary />
    </div>
  );
}
