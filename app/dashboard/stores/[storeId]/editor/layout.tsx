import { StoreProvider } from "@/components/editor/StoreProvider"
import { EditorNavigation } from "@/components/editor/EditorNavigation"

interface EditorLayoutProps {
  children: React.ReactNode
  params: {
    storeId: string
  }
}

export default function EditorLayout({ children, params }: EditorLayoutProps) {
  return (
    <StoreProvider storeId={params.storeId}>
      <div className="flex h-screen">
        {/* Left Sidebar - Navigation */}
        <EditorNavigation />
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </StoreProvider>
  )
} 