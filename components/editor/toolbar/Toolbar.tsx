'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { ComponentType } from '@/types/editor'
import useEditorStore from '@/lib/store/editor'
import { v4 as uuidv4 } from 'uuid'
import {
  Layout,
  Type,
  Image,
  Grid,
  MessageSquare,
  CreditCard,
  Contact,
  FileText,
  Undo2,
  Redo2,
  Eye,
  Code2,
  Save,
  ZoomIn,
  ZoomOut
} from 'lucide-react'
import { StyleEditor } from './StyleEditor'
import { SettingsEditor } from './SettingsEditor'
import { CodeEditor } from './CodeEditor'

interface ComponentTemplate {
  type: ComponentType
  name: string
  icon: React.ReactNode
  description: string
}

const componentTemplates: ComponentTemplate[] = [
  {
    type: 'hero',
    name: 'Hero Section',
    icon: <Layout className="h-4 w-4" />,
    description: 'A large header section with image and text'
  },
  {
    type: 'features',
    name: 'Features Grid',
    icon: <Grid className="h-4 w-4" />,
    description: 'Display your key features in a grid layout'
  },
  {
    type: 'testimonials',
    name: 'Testimonials',
    icon: <MessageSquare className="h-4 w-4" />,
    description: 'Show customer testimonials and reviews'
  },
  {
    type: 'pricing',
    name: 'Pricing Table',
    icon: <CreditCard className="h-4 w-4" />,
    description: 'Display your pricing plans'
  },
  {
    type: 'contact',
    name: 'Contact Form',
    icon: <Contact className="h-4 w-4" />,
    description: 'Add a contact form section'
  },
  {
    type: 'gallery',
    name: 'Image Gallery',
    icon: <Image className="h-4 w-4" />,
    description: 'Create an image gallery or grid'
  },
  {
    type: 'text',
    name: 'Text Content',
    icon: <Type className="h-4 w-4" />,
    description: 'Add formatted text content'
  },
  {
    type: 'custom',
    name: 'Custom Component',
    icon: <FileText className="h-4 w-4" />,
    description: 'Create a custom component'
  }
]

interface ToolbarProps {
  className?: string
}

export function Toolbar({ className }: ToolbarProps) {
  const {
    mode,
    zoom,
    history,
    selectedComponent,
    setMode,
    addComponent,
    updateComponent,
    undo,
    redo,
    setZoom
  } = useEditorStore()

  const [searchTerm, setSearchTerm] = useState('')

  const filteredTemplates = componentTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddComponent = (template: ComponentTemplate) => {
    addComponent({
      id: uuidv4(),
      type: template.type,
      name: template.name,
      settings: {},
      styles: {},
      content: {},
      isHidden: false
    })
  }

  const selectedComponentData = history.present.find(
    component => component.id === selectedComponent
  )

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Top Actions */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={history.past.length === 0}
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={history.future.length === 0}
          >
            <Redo2 className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(zoom - 0.1)}
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{Math.round(zoom * 100)}%</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(zoom + 0.1)}
            disabled={zoom >= 2}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={mode === 'edit' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('edit')}
          >
            Edit
          </Button>
          <Button
            variant={mode === 'preview' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('preview')}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            variant={mode === 'code' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('code')}
          >
            <Code2 className="h-4 w-4 mr-2" />
            Code
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {mode === 'code' ? (
        selectedComponentData ? (
          <CodeEditor
            data={selectedComponentData}
            onUpdate={(updates) => updateComponent(selectedComponentData.id, updates)}
          />
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            Select a component to view its code
          </div>
        )
      ) : (
        <Tabs defaultValue="components" className="flex-1">
          <TabsList className="w-full justify-start border-b rounded-none px-4">
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="styles">Styles</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="components" className="flex-1 p-0">
            <div className="p-4">
              <Label htmlFor="search">Search Components</Label>
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="mt-1"
              />
            </div>
            
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-2 gap-4 p-4">
                {filteredTemplates.map((template) => (
                  <Button
                    key={template.type}
                    variant="outline"
                    className="h-auto flex flex-col items-start p-4 space-y-2"
                    onClick={() => handleAddComponent(template)}
                  >
                    <div className="flex items-center space-x-2">
                      {template.icon}
                      <span className="font-medium">{template.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground text-left">
                      {template.description}
                    </p>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="styles" className="flex-1 p-0">
            {selectedComponentData ? (
              <StyleEditor
                data={selectedComponentData}
                onUpdate={(updates) => updateComponent(selectedComponentData.id, updates)}
              />
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                Select a component to edit its styles
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="flex-1 p-0">
            {selectedComponentData ? (
              <SettingsEditor
                data={selectedComponentData}
                onUpdate={(updates) => updateComponent(selectedComponentData.id, updates)}
              />
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                Select a component to edit its settings
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
} 