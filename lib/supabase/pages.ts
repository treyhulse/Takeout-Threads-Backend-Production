import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { CreatePageParams, Page } from '@/types/pages'

export async function createPage(params: CreatePageParams) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data, error } = await supabase
    .from('Page')
    .insert([{
      store_id: params.store_id,
      org_id: params.org_id,
      name: params.name,
      metadata: params.metadata || { layout: [] }
    }])
    .select()
    .single()

  return { data, error }
} 