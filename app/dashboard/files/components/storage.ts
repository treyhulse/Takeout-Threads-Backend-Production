'use server'

import { createClient } from '@/lib/supabase/client'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes

function transformStorageUrl(url: string): string {
  // Replace the Supabase URL with api.takeout-threads.com
  return url.replace(
    /https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public/,
    'https://api.takeout-threads.com/storage/v1/object/public'
  );
}

// Helper function to get org path
async function getOrgPath(subPath?: string): Promise<string> {
  const { getOrganization } = getKindeServerSession()
  const org = await getOrganization()
  
  if (!org?.orgCode) throw new Error("No organization found")
  
  return `${org.orgCode}${subPath ? `/${subPath}` : ''}`
}

export async function uploadFile(file: File, path?: string) {
  try {
    const orgPath = await getOrgPath(path)
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds 10MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`)
    }

    const filename = `${orgPath}/${file.name}`
    const supabase = createClient()
    
    // Check if file exists
    const { data: existingFiles } = await supabase.storage
      .from('media')
      .list(orgPath, {
        search: file.name
      })

    if (existingFiles?.some(existingFile => existingFile.name === file.name)) {
      throw new Error(`File "${file.name}" already exists`)
    }

    const { data, error } = await supabase.storage
      .from('media')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'text/csv'
      })
    
    if (error) throw error

    return { 
      success: true, 
      data,
      message: `File "${file.name}" uploaded successfully`
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    
    // Return structured error response
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Failed to upload file'
    }
  }
}

export async function getFiles(path?: string, page: number = 1, limit: number = 25) {
  try {
    const orgPath = await getOrgPath(path)
    const supabase = createClient()
    
    // First, get total count without limit
    const { data: allData, error: countError } = await supabase.storage
      .from('media')
      .list(orgPath)
    
    if (countError) throw countError
    
    // Then get paginated data
    const { data, error } = await supabase.storage
      .from('media')
      .list(orgPath, {
        limit: limit,
        offset: (page - 1) * limit,
        sortBy: { column: 'name', order: 'asc' }
      })
    
    if (error) throw error
    
    // Filter out .keep files
    const filteredData = data?.filter(file => !file.name.endsWith('.keep')) || []
    const totalCount = allData?.filter(file => !file.name.endsWith('.keep')).length || 0
    
    return { 
      data: filteredData,
      totalCount,
      page,
      limit
    }
  } catch (error) {
    console.error('Error getting files:', error)
    throw error
  }
}

export async function deleteFile(path: string) {
  try {
    const orgPath = await getOrgPath(path)
    const supabase = createClient()
    const { error } = await supabase.storage
      .from('media')
      .remove([orgPath])
    
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

export async function getFileUrl(path: string) {
  try {
    const orgPath = await getOrgPath(path)
    const supabase = createClient()
    const { data } = await supabase.storage
      .from('media')
      .getPublicUrl(`${orgPath}`)

    if (!data.publicUrl) throw new Error('Failed to get public URL')
    
    // Transform the URL to use our custom domain
    const transformedUrl = transformStorageUrl(data.publicUrl);
    return { data: { publicUrl: transformedUrl } }
  } catch (error) {
    console.error('Error getting file URL:', error)
    throw error
  }
}

export async function createFolder(folderName: string) {
  try {
    const orgPath = await getOrgPath(folderName)
    const supabase = createClient()
    // Create an empty file with a trailing slash to represent a folder
    const { data, error } = await supabase.storage
      .from('media')
      .upload(`${orgPath}/.keep`, new Blob([]))
    
    if (error) throw error
    return { data }
  } catch (error) {
    console.error('Error creating folder:', error)
    throw error
  }
}

export async function searchFiles(searchTerm: string) {
  try {
    const orgPath = await getOrgPath()
    const supabase = createClient()
    const { data: allFiles, error } = await supabase.storage
      .from('media')
      .list(orgPath, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })
    
    if (error) throw error
    
    const filteredFiles = allFiles.filter(file => 
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    return { data: filteredFiles }
  } catch (error) {
    console.error('Error searching files:', error)
    throw error
  }
}

export async function renameFile(oldPath: string, newName: string) {
  try {
    const orgPath = await getOrgPath(oldPath)
    const supabase = createClient()
    const pathParts = orgPath.split('/')
    pathParts[pathParts.length - 1] = newName
    const newPath = pathParts.join('/')

    // First check if target name already exists
    const { data: existingFiles } = await supabase.storage
      .from('media')
      .list(pathParts.slice(0, -1).join('/'), {
        search: newName
      })

    if (existingFiles?.some(file => file.name === newName)) {
      throw new Error(`File "${newName}" already exists`)
    }

    // Copy to new path
    const { error: copyError } = await supabase.storage
      .from('media')
      .copy(oldPath, newPath)

    if (copyError) throw copyError

    // Delete old file
    const { error: deleteError } = await supabase.storage
      .from('media')
      .remove([oldPath])

    if (deleteError) throw deleteError

    return { 
      success: true,
      message: `File renamed to "${newName}" successfully`
    }
  } catch (error) {
    console.error('Error renaming file:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Failed to rename file'
    }
  }
}
