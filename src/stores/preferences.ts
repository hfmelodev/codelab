import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type State = {
  autoPlay: boolean
  expandedModule?: string | null
  modulesListCollapsed: boolean
}

type Actions = {
  setAutoPlay: (autoPlay: boolean) => void
  setExpandedModule: (expandedModule: string | undefined) => void
  setModulesListCollapsed: (modulesListCollapsed: boolean) => void
}

type Store = State & Actions

export const usePreferencesStore = create<Store>()(
  persist(
    set => ({
      autoPlay: false,
      expandedModule: null,
      modulesListCollapsed: false,

      setAutoPlay: (autoPlay: boolean) => set({ autoPlay }),
      setExpandedModule: (expandedModule: string | undefined) => set({ expandedModule }),
      setModulesListCollapsed: (modulesListCollapsed: boolean) => set({ modulesListCollapsed }),
    }),
    {
      name: 'codelab:preferences',
    }
  )
)
