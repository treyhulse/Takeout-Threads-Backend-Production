'use client'

import { ComponentData, ComponentStyles } from "@/types/editor"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Check, Copy } from "lucide-react"

interface StyleEditorProps {
  data: ComponentData
  onUpdate: (updates: Partial<ComponentData>) => void
}

interface StyleInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  className?: string
}

function StyleInput({ label, value, onChange, className }: StyleInputProps) {
  return (
    <div className={className}>
      <Label className="text-xs">{label}</Label>
      <Input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  )
}

export function StyleEditor({ data, onUpdate }: StyleEditorProps) {
  const [activeTab, setActiveTab] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [copied, setCopied] = useState(false)

  const handleStyleUpdate = (updates: Partial<ComponentStyles>) => {
    if (activeTab === 'desktop') {
      onUpdate({
        styles: {
          ...data.styles,
          ...updates
        }
      })
    } else {
      onUpdate({
        responsive: {
          ...data.responsive,
          [activeTab]: {
            ...data.responsive?.[activeTab],
            ...updates
          }
        }
      })
    }
  }

  const currentStyles = activeTab === 'desktop' 
    ? data.styles 
    : data.responsive?.[activeTab] || {}

  const copyStyles = () => {
    const styles = activeTab === 'desktop' ? data.styles : data.responsive?.[activeTab]
    if (styles) {
      navigator.clipboard.writeText(JSON.stringify(styles, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="px-4 pt-4">
        <h3 className="font-semibold mb-2">Styles</h3>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="w-full">
            <TabsTrigger value="desktop">Desktop</TabsTrigger>
            <TabsTrigger value="tablet">Tablet</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="h-[calc(100vh-15rem)]">
        <div className="space-y-6 p-4">
          {/* Spacing */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Spacing</h4>
            <div className="grid grid-cols-2 gap-4">
              <StyleInput
                label="Padding"
                value={currentStyles.padding || ''}
                onChange={(value) => handleStyleUpdate({ padding: value })}
              />
              <StyleInput
                label="Margin"
                value={currentStyles.margin || ''}
                onChange={(value) => handleStyleUpdate({ margin: value })}
              />
            </div>
          </div>

          <Separator />

          {/* Colors */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Colors</h4>
            <div className="space-y-4">
              <StyleInput
                label="Background Color"
                value={currentStyles.backgroundColor || ''}
                onChange={(value) => handleStyleUpdate({ backgroundColor: value })}
              />
              <StyleInput
                label="Text Color"
                value={currentStyles.textColor || ''}
                onChange={(value) => handleStyleUpdate({ textColor: value })}
              />
            </div>
          </div>

          <Separator />

          {/* Background */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Background</h4>
            <StyleInput
              label="Background Image URL"
              value={currentStyles.backgroundImage || ''}
              onChange={(value) => handleStyleUpdate({ backgroundImage: value })}
            />
          </div>

          <Separator />

          {/* Custom CSS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Custom CSS</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyStyles}
                className="h-8 px-2"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Textarea
              value={currentStyles.customCSS || ''}
              onChange={(e) => handleStyleUpdate({ customCSS: e.target.value })}
              placeholder="Enter custom CSS"
              className="font-mono text-sm"
              rows={6}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  )
} 