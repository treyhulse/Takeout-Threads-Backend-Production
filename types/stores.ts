import { JsonValue } from "@prisma/client/runtime/library"

export type Store = {
  id: string
  org_id: string
  theme_id: string | null
  store_logo_url: string | null
  slogan: string | null
  name: string
  subdomain: string
  domain: string | null
  domain_verified: boolean
  verification_code: string | null
  timezone: string | null
  metadata: JsonValue
  theme?: Theme | null
  pages?: Page[]
}

export type Theme = {
  id: string
  org_id: string
  name: string
  metadata: JsonValue
}

export type Page = {
  id: string
  store_id: string
  org_id: string
  name: string
  metadata: JsonValue
} 