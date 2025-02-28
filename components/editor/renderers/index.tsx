'use client'

import { ComponentData, ComponentType } from "@/types/editor"
import { HeroRenderer } from "./HeroRenderer"
import { cn } from "@/lib/utils"

// Placeholder components until we implement them
interface BaseRendererProps {
  data: ComponentData
  isEditing: boolean
  onUpdate?: (updates: Partial<ComponentData>) => void
}

interface ComponentRendererProps {
  data: ComponentData
  isEditing?: boolean
  onUpdate?: (updates: Partial<ComponentData>) => void
  className?: string
}

const componentMap = {
  hero: HeroRenderer,
  features: PlaceholderRenderer,
  productGrid: PlaceholderRenderer,
  testimonials: PlaceholderRenderer,
  pricing: PlaceholderRenderer,
  contact: PlaceholderRenderer,
  gallery: PlaceholderRenderer,
  products: PlaceholderRenderer,
  text: PlaceholderRenderer,
  cta: PlaceholderRenderer,
  custom: PlaceholderRenderer,
} as const

function PlaceholderRenderer({ data, isEditing, onUpdate }: BaseRendererProps) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="text-sm text-muted-foreground">
        Component type &quot;{data.type}&quot; is not yet implemented
      </div>
      <div className="mt-2 text-xs text-muted-foreground/70">
        Name: {data.name}
      </div>
    </div>
  )
}

export function ComponentRenderer({ data, isEditing, onUpdate, className }: ComponentRendererProps) {
  const Renderer = componentMap[data.type as ComponentType]

  if (!Renderer) {
    console.warn(`No renderer found for component type: ${data.type}`)
    return null
  }

  const isHidden = Boolean(data.isHidden)

  return (
    <div 
      className={cn(
        "relative",
        isHidden && "opacity-50",
        className
      )}
    >
      <Renderer 
        data={data} 
        isEditing={isEditing ?? false} 
        onUpdate={onUpdate}
      />
    </div>
  )
} 