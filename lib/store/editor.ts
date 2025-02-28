import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { EditorState, ComponentData, EditorMode } from '@/types/editor'

interface EditorStore extends EditorState {
  setSelectedComponent: (id: string | null) => void
  setMode: (mode: EditorMode) => void
  addComponent: (component: ComponentData) => void
  updateComponent: (id: string, updates: Partial<ComponentData>) => void
  removeComponent: (id: string) => void
  moveComponent: (fromIndex: number, toIndex: number) => void
  undo: () => void
  redo: () => void
  setZoom: (zoom: number) => void
  setIsDragging: (isDragging: boolean) => void
}

const useEditorStore = create<EditorStore>()(
  devtools(
    (set, get) => ({
      selectedComponent: null,
      mode: 'edit',
      history: {
        past: [],
        present: [],
        future: []
      },
      isDragging: false,
      zoom: 1,

      setSelectedComponent: (id) => set({ selectedComponent: id }),
      
      setMode: (mode) => set({ mode }),
      
      addComponent: (component) => {
        const { present } = get().history
        const newPresent = [...present, component]
        
        set((state) => ({
          history: {
            past: [...state.history.past, present],
            present: newPresent,
            future: []
          }
        }))
      },
      
      updateComponent: (id, updates) => {
        const { present } = get().history
        const newPresent = present.map(component => 
          component.id === id ? { ...component, ...updates } : component
        )
        
        set((state) => ({
          history: {
            past: [...state.history.past, present],
            present: newPresent,
            future: []
          }
        }))
      },
      
      removeComponent: (id) => {
        const { present } = get().history
        const newPresent = present.filter(component => component.id !== id)
        
        set((state) => ({
          history: {
            past: [...state.history.past, present],
            present: newPresent,
            future: []
          }
        }))
      },
      
      moveComponent: (fromIndex, toIndex) => {
        const { present } = get().history
        const newPresent = [...present]
        const [movedComponent] = newPresent.splice(fromIndex, 1)
        newPresent.splice(toIndex, 0, movedComponent)
        
        set((state) => ({
          history: {
            past: [...state.history.past, present],
            present: newPresent,
            future: []
          }
        }))
      },
      
      undo: () => {
        const { past, present, future } = get().history
        
        if (past.length === 0) return
        
        const newPast = past.slice(0, -1)
        const newPresent = past[past.length - 1]
        
        set({
          history: {
            past: newPast,
            present: newPresent,
            future: [present, ...future]
          }
        })
      },
      
      redo: () => {
        const { past, present, future } = get().history
        
        if (future.length === 0) return
        
        const [newPresent, ...newFuture] = future
        
        set({
          history: {
            past: [...past, present],
            present: newPresent,
            future: newFuture
          }
        })
      },
      
      setZoom: (zoom) => set({ zoom }),
      
      setIsDragging: (isDragging) => set({ isDragging })
    })
  )
)

export default useEditorStore 