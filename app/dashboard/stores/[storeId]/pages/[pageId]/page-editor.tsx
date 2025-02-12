"use client"

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Component } from "@/types/components"
import { Page } from "@/types/pages"
import { useState } from "react"
import { Save, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { updatePage } from "@/lib/supabase/pages"

interface PageEditorProps {
  page: Page
  components: Component[]
}

interface LayoutItem {
  id: string
  type: string
  settings: Record<string, any>
}

export function PageEditor({ page, components }: PageEditorProps) {
  const [layout, setLayout] = useState<LayoutItem[]>(
    (page.metadata?.layout || []).map((item: any) => ({
      id: `${Date.now()}-${Math.random()}`,
      type: item.type,
      settings: item.settings || {}
    }))
  )
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    if (result.source.droppableId === "components" && result.destination.droppableId === "canvas") {
      const component = components.find(c => c.id === result.draggableId)
      if (component) {
        setLayout([...layout, {
          id: `${component.id}-${Date.now()}`,
          type: component.metadata?.type || 'unknown',
          settings: component.metadata?.settings || {}
        }])
      }
    } else if (result.source.droppableId === "canvas" && result.destination.droppableId === "canvas") {
      const items = Array.from(layout)
      const [reorderedItem] = items.splice(result.source.index, 1)
      items.splice(result.destination.index, 0, reorderedItem)
      setLayout(items)
    }
  }

  const updateComponentSettings = (id: string, settings: Record<string, any>) => {
    setLayout(layout.map(item => 
      item.id === id ? { ...item, settings: { ...item.settings, ...settings } } : item
    ))
  }

  const removeComponent = (id: string) => {
    setLayout(layout.filter(item => item.id !== id))
  }

  const saveLayout = async () => {
    try {
      const result = await updatePage(page.id, {
        layout: layout.map(({ type, settings }) => ({ type, settings }))
      })
      
      if (result.error) throw new Error(result.error)
      toast.success('Layout saved successfully')
    } catch (error) {
      toast.error('Failed to save layout')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={saveLayout}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <DragDropContext onDragEnd={onDragEnd}>
          {/* Component Sidebar */}
          <Card className="col-span-3 p-4">
            <h2 className="font-semibold mb-4">Components</h2>
            <Droppable droppableId="components" isDropDisabled>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {components.map((component, index) => (
                    <Draggable key={component.id} draggableId={component.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-muted p-3 rounded-md cursor-move hover:bg-muted/80"
                        >
                          <p className="font-medium">{component.name}</p>
                          <p className="text-sm text-muted-foreground">{component.metadata?.type}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Card>

          {/* Page Canvas */}
          <div className="col-span-9 space-y-4">
            <Droppable droppableId="canvas">
              {(provided) => (
                <Card
                  className="p-4 min-h-[600px]"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {layout.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="mb-4 relative group"
                        >
                          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeComponent(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div
                            {...provided.dragHandleProps}
                            onClick={() => setSelectedComponent(item.id)}
                            className={`cursor-move ${selectedComponent === item.id ? 'ring-2 ring-primary' : ''}`}
                          >
                            <ComponentRenderer
                              type={item.type}
                              settings={item.settings}
                              onSettingsChange={(settings) => updateComponentSettings(item.id, settings)}
                              isSelected={selectedComponent === item.id}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Card>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}

function ComponentRenderer({ 
  type, 
  settings, 
  onSettingsChange,
  isSelected 
}: { 
  type: string
  settings: any
  onSettingsChange: (settings: Record<string, any>) => void
  isSelected: boolean 
}) {
  switch (type) {
    case 'hero':
      return (
        <div className="bg-primary/10 p-12 rounded-lg text-center relative">
          {isSelected && (
            <div className="absolute inset-x-0 -top-12 bg-background p-2 rounded-t-lg border-t border-x">
              <Input
                value={settings.title || ''}
                onChange={(e) => onSettingsChange({ title: e.target.value })}
                placeholder="Hero Title"
                className="mb-2"
              />
              <Input
                value={settings.subtitle || ''}
                onChange={(e) => onSettingsChange({ subtitle: e.target.value })}
                placeholder="Hero Subtitle"
              />
            </div>
          )}
          <h2 className="text-4xl font-bold">{settings.title || 'Hero Title'}</h2>
          <p className="mt-4 text-xl">{settings.subtitle || 'Hero Subtitle'}</p>
        </div>
      )
    case 'text':
      return (
        <div className="prose max-w-none">
          {isSelected ? (
            <textarea
              value={settings.content || ''}
              onChange={(e) => onSettingsChange({ content: e.target.value })}
              className="w-full min-h-[100px] p-2 rounded-md border"
              placeholder="Enter text content..."
            />
          ) : (
            <p>{settings.content || 'Text block content'}</p>
          )}
        </div>
      )
    default:
      return <div>Unknown component type: {type}</div>
  }
} 