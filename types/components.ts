export interface Component {
  id: string
  org_id: string
  name: string
  metadata: {
    type: 'hero' | 'gallery' | 'text' | 'products' | 'contact'
    settings: {
      title?: string
      subtitle?: string
      alignment?: 'left' | 'center' | 'right'
      style?: 'default' | 'minimal' | 'bold'
      // Add other common settings as needed
    }
    content?: Record<string, any>
  } | null | any
}

export interface CreateComponentParams {
  org_id: string
  name: string
  metadata: Component['metadata']
} 