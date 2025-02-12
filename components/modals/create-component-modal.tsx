"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { createComponent } from "@/lib/supabase/components"
import { useRouter } from "next/navigation"

const COMPONENT_TYPES = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'gallery', label: 'Image Gallery' },
  { value: 'text', label: 'Text Block' },
  { value: 'products', label: 'Products Grid' },
  { value: 'contact', label: 'Contact Form' },
] as const

interface CreateComponentModalProps {
  orgId: string
}

export function CreateComponentModal({ orgId }: CreateComponentModalProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [type, setType] = useState<typeof COMPONENT_TYPES[number]['value']>('hero')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createComponent({
        org_id: orgId,
        name,
        metadata: {
          type,
          settings: {
            title: '',
            subtitle: '',
            alignment: 'center',
            style: 'default'
          }
        }
      })
      
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Component
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Component</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Component Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter component name"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Component Type</Label>
            <Select
              value={type}
              onValueChange={(value: typeof type) => setType(value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select component type" />
              </SelectTrigger>
              <SelectContent>
                {COMPONENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={loading || !name || !type}>
            Create Component
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 