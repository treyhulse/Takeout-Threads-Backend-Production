'use client'

import { ComponentData, ComponentType } from "@/types/editor"
import { HeroRenderer } from "./HeroRenderer"
import { cn } from "@/lib/utils"

// Placeholder components until we implement them
const PlaceholderRenderer = ({ data }: { data: ComponentData }) => (
  <div className="p-4 border border-dashed rounded-lg">
    <p className="text-muted-foreground text-center">{data.type} component (coming soon)</p>
  </div>
)

interface ComponentRendererProps {
  data: ComponentData
  isEditing?: boolean
  onUpdate?: (updates: Partial<ComponentData>) => void
  className?: string
}

const componentMap = {
  hero: HeroRenderer,
  features: PlaceholderRenderer,
  testimonials: PlaceholderRenderer,
  pricing: PlaceholderRenderer,
  contact: PlaceholderRenderer,
  gallery: PlaceholderRenderer,
  products: PlaceholderRenderer,
  text: PlaceholderRenderer,
  custom: PlaceholderRenderer,
} as const

export function ComponentRenderer({ data, isEditing, onUpdate, className }: ComponentRendererProps) {
  const Renderer = componentMap[data.type as ComponentType]

  if (!Renderer) {
    console.warn(`No renderer found for component type: ${data.type}`)
    return null
  }

  return (
    <div 
      className={cn(
        "relative",
        data.isHidden && "opacity-50",
        className
      )}
    >
      <Renderer 
        data={data} 
        isEditing={isEditing} 
        onUpdate={onUpdate}
      />
    </div>
  )
} 