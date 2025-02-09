import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Notifications() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
            3
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        <div className="flex flex-col gap-2 p-2">
          <DropdownMenuItem className="cursor-pointer">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">New message received</p>
              <p className="text-xs text-muted-foreground">2 minutes ago</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">System update completed</p>
              <p className="text-xs text-muted-foreground">1 hour ago</p>
            </div>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 