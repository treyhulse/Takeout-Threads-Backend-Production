'use client'

import { ComponentData } from '@/types/editor'
import { HeroRenderer } from './HeroRenderer'

interface ComponentRendererProps {
  component: ComponentData
  isEditing: boolean
}

export function ComponentRenderer({ component, isEditing }: ComponentRendererProps) {
  // For now, we only have the hero renderer
  // We'll add more renderers as we create them
  const renderers: Partial<Record<ComponentData['type'], React.ComponentType<{ data: ComponentData; isEditing: boolean }>>> = {
    hero: HeroRenderer,
  }

  const Renderer = renderers[component.type]

  if (!Renderer) {
    return (
      <div className="p-4 border rounded-lg">
        <div className="text-sm text-muted-foreground">
          Component type &quot;{component.type}&quot; is not yet implemented
        </div>
        <div className="mt-2 text-xs text-muted-foreground/70">
          Name: {component.name}
        </div>
      </div>
    )
  }

  return <Renderer data={component} isEditing={isEditing} />
} 