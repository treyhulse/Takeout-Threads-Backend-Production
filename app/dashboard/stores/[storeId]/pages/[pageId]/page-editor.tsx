"use client"

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card } from "@/components/ui/card"
import { Component } from "@/types/components"
import { Page } from "@/types/pages"
import { useState } from "react"

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
    (page.metadata?.layout || []).map((item: { type: any }) => ({
      id: `${Date.now()}-${Math.random()}`,
      type: item.type,
      settings: {}
    }))
  )

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    if (result.source.droppableId === "components" && result.destination.droppableId === "canvas") {
      // Add component to canvas
      const component = components.find(c => c.id === result.draggableId)
      if (component) {
        setLayout([...layout, {
          id: `${component.id}-${Date.now()}`,
          type: component.metadata?.type || 'unknown',
          settings: component.metadata?.settings || {}
        }])
      }
    }
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <DragDropContext onDragEnd={onDragEnd}>
        {/* Component Sidebar */}
        <Card className="col-span-3 p-4">
          <h2 className="font-semibold mb-4">Components</h2>
          <Droppable droppableId="components" isDropDisabled>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {components.map((component, index) => (
                  <Draggable
                    key={component.id}
                    draggableId={component.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-muted p-3 rounded-md cursor-move hover:bg-muted/80"
                      >
                        <p className="font-medium">{component.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {component.metadata?.type}
                        </p>
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
        <div className="col-span-9">
          <Droppable droppableId="canvas">
            {(provided) => (
              <Card
                className="p-4 min-h-[600px]"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {layout.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="mb-4"
                      >
                        <ComponentRenderer type={item.type} settings={item.settings} />
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
  )
}

// Basic component renderer - expand this based on your needs
function ComponentRenderer({ type, settings }: { type: string, settings: any }) {
  switch (type) {
    case 'hero':
      return (
        <div className="bg-primary/10 p-12 rounded-lg text-center">
          <h2 className="text-2xl font-bold">{settings.title || 'Hero Title'}</h2>
          <p className="mt-2">{settings.subtitle || 'Hero Subtitle'}</p>
        </div>
      )
    case 'text':
      return (
        <div className="prose max-w-none">
          <p>{settings.content || 'Text block content'}</p>
        </div>
      )
    // Add more component types as needed
    default:
      return <div>Unknown component type: {type}</div>
  }
} 