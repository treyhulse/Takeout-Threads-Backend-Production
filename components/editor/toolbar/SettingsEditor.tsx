'use client'

import { ComponentData } from "@/types/editor"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

interface SettingsEditorProps {
  data: ComponentData
  onUpdate: (updates: Partial<ComponentData>) => void
}

interface SettingInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  description?: string
  className?: string
}

function SettingInput({ label, value, onChange, description, className }: SettingInputProps) {
  return (
    <div className={className}>
      <Label className="text-sm">{label}</Label>
      {description && (
        <p className="text-xs text-muted-foreground mb-2">{description}</p>
      )}
      <Input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  )
}

export function SettingsEditor({ data, onUpdate }: SettingsEditorProps) {
  const handleSettingUpdate = (key: string, value: any) => {
    onUpdate({
      settings: {
        ...data.settings,
        [key]: value
      }
    })
  }

  const handleSeoUpdate = (updates: Record<string, any>) => {
    onUpdate({
      settings: {
        ...data.settings,
        seo: {
          ...data.settings.seo,
          ...updates
        }
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="px-4 pt-4">
        <h3 className="font-semibold mb-2">Settings</h3>
      </div>

      <ScrollArea className="h-[calc(100vh-15rem)]">
        <div className="space-y-6 p-4">
          {/* Basic Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Basic Settings</h4>
            <div className="space-y-4">
              <SettingInput
                label="Component ID"
                value={data.id}
                onChange={(value) => handleSettingUpdate('id', value)}
                description="Unique identifier for this component"
              />
              <SettingInput
                label="Component Name"
                value={data.name}
                onChange={(value) => handleSettingUpdate('name', value)}
                description="Display name for this component"
              />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Visibility</Label>
                  <p className="text-xs text-muted-foreground">
                    Show or hide this component
                  </p>
                </div>
                <Switch
                  checked={!data.isHidden}
                  onCheckedChange={(checked) => onUpdate({ isHidden: !checked })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Component-specific Settings */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="animation">
              <AccordionTrigger className="text-sm">Animation</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <SettingInput
                    label="Animation Type"
                    value={data.settings.animation?.type || ''}
                    onChange={(value) => handleSettingUpdate('animation', { type: value })}
                    description="e.g., fade, slide, zoom"
                  />
                  <SettingInput
                    label="Animation Duration"
                    value={data.settings.animation?.duration || ''}
                    onChange={(value) => handleSettingUpdate('animation', { duration: value })}
                    description="Duration in milliseconds"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="advanced">
              <AccordionTrigger className="text-sm">Advanced</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <SettingInput
                    label="Custom Classes"
                    value={data.settings.customClasses || ''}
                    onChange={(value) => handleSettingUpdate('customClasses', value)}
                    description="Additional CSS classes"
                  />
                  <SettingInput
                    label="Data Attributes"
                    value={data.settings.dataAttributes || ''}
                    onChange={(value) => handleSettingUpdate('dataAttributes', value)}
                    description="Custom data attributes (JSON format)"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator />

          {/* SEO Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">SEO Settings</h4>
            <div className="space-y-4">
              <SettingInput
                label="SEO Title"
                value={data.settings.seo?.title || ''}
                onChange={(value) => handleSeoUpdate({ title: value })}
                description="Title for search engines"
              />
              <div className="space-y-2">
                <Label className="text-sm">SEO Description</Label>
                <p className="text-xs text-muted-foreground">
                  Description for search engines
                </p>
                <Textarea
                  value={data.settings.seo?.description || ''}
                  onChange={(e) => handleSeoUpdate({ description: e.target.value })}
                  placeholder="Enter SEO description"
                  className="mt-1"
                  rows={3}
                />
              </div>
              <SettingInput
                label="Keywords"
                value={data.settings.seo?.keywords?.join(', ') || ''}
                onChange={(value) => handleSeoUpdate({ 
                  keywords: value.split(',').map(k => k.trim()).filter(Boolean)
                })}
                description="Comma-separated keywords"
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
} 