// lib/supabase/storage.ts
"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createClient } from "@/lib/supabase/client";

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
  const orgCode = org.orgCode;

  // Build a unique file name and path.
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${orgCode}/${fileName}`;

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

  console.log('Raw URL from Supabase:', publicUrlData.publicUrl);
  console.log('URL characters:', Array.from(publicUrlData.publicUrl).map(c => c.charCodeAt(0)));
  
  // Ensure the URL is properly formatted without any encoding issues
  const cleanUrl = new URL(publicUrlData.publicUrl);
  console.log('Clean URL:', cleanUrl.toString());
  return cleanUrl.toString();
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
  
  const orgCode = org.orgCode;

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
      // Debug the path components
      console.log('orgCode raw:', orgCode);
      console.log('orgCode chars:', Array.from(orgCode).map(c => c.charCodeAt(0)));
      console.log('file.name raw:', file.name);
      console.log('file.name chars:', Array.from(file.name).map(c => c.charCodeAt(0)));
      
      const path = `${orgCode}/${file.name}`;
      console.log('Combined path:', path);
      console.log('Path chars:', Array.from(path).map(c => c.charCodeAt(0)));

      const { data: publicUrlData } = createClient().storage
        .from("media")
        .getPublicUrl(path.trim()); // Try trimming the path
      
      console.log('Raw URL from Supabase (getImages):', publicUrlData.publicUrl);
      console.log('URL characters (getImages):', Array.from(publicUrlData.publicUrl).map(c => c.charCodeAt(0)));
      
      // Return the raw URL without trying to parse it
      return publicUrlData.publicUrl.trim().replace(/[\r\n]+/g, '');
    })
    .filter(Boolean);
}

export async function deleteImages(urls: string[]) {
  const { getOrganization } = getKindeServerSession();
  const org = await getOrganization();
  
  if (!org?.orgCode) {
    throw new Error("No organization found");
  }

  const filePaths = urls.map(url => {
    const fileName = url.split('/').pop();
    return `${org.orgCode}/${fileName}`;
  });

  const { error } = await createClient().storage
    .from("media")
    .remove(filePaths);

  if (error) {
    console.error("Error deleting files:", error);
    throw error;
  }
}
