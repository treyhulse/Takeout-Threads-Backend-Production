'use client'

import { ComponentConfig } from "@/types/editor"
import { cn } from "@/lib/utils"
import { useStore } from "../StoreProvider"

// Component Types
import { Hero } from "@/components/storefront/Hero"
import { Features } from "@/components/storefront/Features"
import { ProductGrid } from "@/components/storefront/ProductGrid"
import { TextContent } from "@/components/storefront/TextContent"
import { CallToAction } from "@/components/storefront/CallToAction"

interface ComponentRendererProps {
  config: ComponentConfig
  isEditing?: boolean
  onSelect?: (id: string) => void
  isSelected?: boolean
}

export function ComponentRenderer({ 
  config, 
  isEditing = false,
  onSelect,
  isSelected = false
}: ComponentRendererProps) {
  const { updateComponent } = useStore()

  const handleUpdate = (updates: Partial<ComponentConfig>) => {
    updateComponent(config.id, updates)
  }

  const componentProps = {
    ...config.props,
    className: cn(config.styles?.className, isSelected && "ring-2 ring-primary ring-offset-2"),
    style: config.styles,
    onClick: isEditing ? () => onSelect?.(config.id) : undefined,
    onUpdate: isEditing ? handleUpdate : undefined
  }

  switch (config.type) {
    case 'hero':
      return <Hero {...componentProps} />
    case 'features':
      return <Features {...componentProps} />
    case 'productGrid':
      return <ProductGrid {...componentProps} />
    case 'text':
      return <TextContent {...componentProps} />
    case 'cta':
      return <CallToAction {...componentProps} />
    default:
      return (
        <div className="p-4 border border-dashed rounded-lg">
          <p className="text-muted-foreground">Unknown component type: {config.type}</p>
        </div>
      )
  }
} 