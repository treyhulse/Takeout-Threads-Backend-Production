'use client'

import { ComponentData } from "@/types/editor"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { Check, Copy, Code2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeEditorProps {
  data: ComponentData
  onUpdate?: (updates: Partial<ComponentData>) => void
}

export function CodeEditor({ data, onUpdate }: CodeEditorProps) {
  const [activeTab, setActiveTab] = useState<'json' | 'html'>('json')
  const [copied, setCopied] = useState(false)

  const jsonCode = JSON.stringify(data, null, 2)
  
  const generateStyles = () => {
    const styles = {
      padding: data.styles.padding,
      margin: data.styles.margin,
      backgroundColor: data.styles.backgroundColor,
      color: data.styles.textColor,
      ...data.styles
    }
    return Object.entries(styles)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join(';')
  }

  const generateDataAttributes = () => {
    return Object.entries(data.settings.dataAttributes || {})
      .map(([key, value]) => `data-${key}="${value}"`)
      .join(' ')
  }

  const htmlCode = [
    `<!-- Component: ${data.name} -->`,
    `<div class="${cn(
      'relative',
      data.settings.customClasses,
      data.isHidden && 'hidden'
    )}"`,
    `  style="${generateStyles()}"`,
    `  ${generateDataAttributes()}>`,
    `  <!-- Component Content -->`,
    `  ${generateComponentHtml(data)}`,
    `</div>`
  ].join('\n')

  const copyCode = () => {
    const code = activeTab === 'json' ? jsonCode : htmlCode
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Code</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyCode}
            className="h-8 px-2"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="w-full">
            <TabsTrigger value="json">JSON</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="h-[calc(100vh-15rem)]">
        <div className="p-4">
          <pre className="p-4 rounded-lg bg-muted font-mono text-sm whitespace-pre-wrap break-all">
            <code>
              {activeTab === 'json' ? jsonCode : htmlCode}
            </code>
          </pre>
        </div>
      </ScrollArea>
    </div>
  )
}

function generateComponentHtml(data: ComponentData): string {
  switch (data.type) {
    case 'hero':
      return [
        `<div class="container mx-auto px-4 text-center">`,
        `  <h1 class="text-4xl font-bold mb-4">${data.content.heading || ''}</h1>`,
        `  <p class="text-xl mb-8">${data.content.subheading || ''}</p>`,
        data.content.buttonText ? [
          `  <a href="${data.content.buttonLink || '#'}" `,
          `     class="inline-flex items-center justify-center rounded-md text-sm font-medium`,
          `            ring-offset-background transition-colors focus-visible:outline-none`,
          `            focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`,
          `            disabled:pointer-events-none disabled:opacity-50 bg-primary`,
          `            text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">`,
          `    ${data.content.buttonText}`,
          `  </a>`
        ].join('\n') : '',
        `</div>`
      ].join('\n')

    case 'text':
      return [
        `<div class="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto">`,
        `  ${data.content.text || ''}`,
        `</div>`
      ].join('\n')

    default:
      return `<!-- ${data.type} component content -->`
  }
} 