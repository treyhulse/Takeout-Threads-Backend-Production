export interface Page {
  id: string
  store_id: string
  org_id: string
  name: string
  metadata: {
    layout: Array<{
      type: string
      // Add other layout-specific properties as needed
    }>
  } | null
}

export interface CreatePageParams {
  store_id: string
  org_id: string
  name: string
  metadata?: {
    layout: Array<{
      type: string
    }>
  }
} 