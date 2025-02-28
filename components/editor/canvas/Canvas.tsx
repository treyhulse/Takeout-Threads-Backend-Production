'use client'

import { useState } from 'react'
import { useStore } from '../StoreProvider'
import { ComponentRenderer } from './ComponentRenderer'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ComponentPicker } from './ComponentPicker'
import { toast } from 'sonner'

export function Canvas() {
  const { currentLayout } = useStore()
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [showPicker, setShowPicker] = useState(false)

  const handleSelectComponent = (id: string) => {
    setSelectedComponent(id)
    toast.info('Component selected')
  }

  return (
    <div className="relative min-h-full">
      {/* Component List */}
      <div className="space-y-4">
        {currentLayout.map((component) => (
          <ComponentRenderer
            key={component.id}
            config={component}
            isEditing={true}
            onSelect={handleSelectComponent}
            isSelected={selectedComponent === component.id}
          />
        ))}
      </div>

      {/* Add Component Button */}
      <Button
        variant="outline"
        className="mt-4 w-full"
        onClick={() => setShowPicker(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Component
      </Button>

      {/* Component Picker */}
      <ComponentPicker
        open={showPicker}
        onClose={() => setShowPicker(false)}
      />
    </div>
  )
} 