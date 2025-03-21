// lib/supabase/storage.ts
"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createClient } from "@/lib/supabase/client";

function sanitizePath(path: string): string {
  return path
    .trim()
    .replace(/[\r\n]+/g, '')
    .replace(/%0A/g, '')
    .replace(/%20/g, ' ');
}

function transformStorageUrl(url: string): string {
  // Replace the Supabase URL with api.takeout-threads.com
  return url.replace(
    /https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public/,
    'https://api.takeout-threads.com/storage/v1/object/public'
  );
}

/**
 * Uploads an image file to the organization's folder.
 * The file is stored under a path like: `<orgCode>/<timestamp>.<ext>`
 */
export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) {
    throw new Error("No file provided");
  }

  // Retrieve the organization information using Kinde
  const { getOrganization } = getKindeServerSession();
  const org = await getOrganization();
  if (!org?.orgCode) throw new Error("No organization found");
  const orgCode = sanitizePath(org.orgCode);

  // Build a unique file name and path.
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = sanitizePath(`${orgCode}/${fileName}`);

  console.log('Upload path:', filePath);
  console.log('Path characters:', Array.from(filePath).map(c => c.charCodeAt(0)));

  // Convert the File into a Buffer (required in Node)
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const { error } = await createClient().storage
    .from("media")
    .upload(filePath, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  // Retrieve and return the public URL of the uploaded file.
  const { data: publicUrlData } = createClient().storage
    .from("media")
    .getPublicUrl(filePath);
  
  // Transform the URL to use our custom domain
  const cleanUrl = transformStorageUrl(sanitizePath(publicUrlData.publicUrl));
  console.log('Clean URL:', cleanUrl);
  console.log('Clean URL characters:', Array.from(cleanUrl).map(c => c.charCodeAt(0)));
  return cleanUrl;
}

/**
 * Lists images stored under the current organization's folder.
 */
export async function getImages() {
  const { getOrganization } = getKindeServerSession();
  const org = await getOrganization();
  
  if (!org?.orgCode) {
    console.error("No organization found in getImages");
    throw new Error("No organization found");
  }
  
  const orgCode = sanitizePath(org.orgCode);

  const { data, error } = await createClient().storage
    .from("media")
    .list(orgCode, {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error) {
    console.error("Supabase list error:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Filter for image files and map to public URLs
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  return data
    .filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return extension && imageExtensions.includes(extension);
    })
    .map((file) => {
      const path = sanitizePath(`${orgCode}/${file.name}`);
      console.log('Image path:', path);
      console.log('Path characters:', Array.from(path).map(c => c.charCodeAt(0)));

      const { data: publicUrlData } = createClient().storage
        .from("media")
        .getPublicUrl(path);
      
      const cleanUrl = transformStorageUrl(sanitizePath(publicUrlData.publicUrl));
      console.log('Clean URL:', cleanUrl);
      console.log('URL characters:', Array.from(cleanUrl).map(c => c.charCodeAt(0)));
      
      return cleanUrl;
    })
    .filter(Boolean);
}

export async function deleteImages(urls: string[]) {
  const { getOrganization } = getKindeServerSession();
  const org = await getOrganization();
  
  if (!org?.orgCode) {
    throw new Error("No organization found");
  }

  const orgCode = sanitizePath(org.orgCode);

  const filePaths = urls.map(url => {
    const fileName = url.split('/').pop();
    return sanitizePath(`${orgCode}/${fileName}`);
  });

  const { error } = await createClient().storage
    .from("media")
    .remove(filePaths);

  if (error) {
    console.error("Error deleting files:", error);
    throw error;
  }
}
