export type Store = {
  id: string
  org_id: string
  theme_id: string | null
  store_logo_url: string | null
  slogan: string | null
  name: string
  subdomain: string
  domain: string | null
  timezone: string | null
  metadata: Record<string, any> | null
  theme?: Theme
  pages?: Page[]
}

export type Theme = {
  id: string
  org_id: string
  name: string
  metadata: Record<string, any> | null
}

export type Page = {
  id: string
  store_id: string
  org_id: string
  name: string
  metadata: Record<string, any> | null
} 