"use client"

import { LayoutGridIcon, ListIcon } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useEffect } from "react"

interface ViewToggleProps {
  view: "grid" | "list"
  onViewChange: (view: "grid" | "list") => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  const [savedView, setSavedView] = useLocalStorage<"grid" | "list">("fileViewMode", view)

  // Sync the saved view with parent component
  useEffect(() => {
    onViewChange(savedView)
  }, [savedView, onViewChange])

  return (
    <ToggleGroup 
      type="single" 
      value={savedView} 
      onValueChange={(value) => {
        if (value) {
          setSavedView(value as "grid" | "list")
        }
      }}
    >
      <ToggleGroupItem value="grid" aria-label="Grid view">
        <LayoutGridIcon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List view">
        <ListIcon className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
} 