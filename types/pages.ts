export interface Page {
  id: string
  store_id: string
  org_id: string
  name: string
  metadata: {
    layout: Array<{
      type: string
    }>
  } | null | any
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