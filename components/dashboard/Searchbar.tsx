import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function Searchbar() {
  return (
    <div className="flex w-full max-w-2xl items-center space-x-2">
      <div className="relative flex flex-1 items-center">
        <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="pl-8 bg-background"
        />
      </div>
    </div>
  )
} 