import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Modal } from '../types/general'

interface GeneralStore {
    activeModal: Modal | null
    drawerOpen: boolean
    setActiveModal: (modal: Modal | null) => void
    toggleDrawer: () => void
}

export const useGeneralStore = create<GeneralStore>()(
    persist(
        (set) => ({
            activeModal: null,
            drawerOpen:false,
            setActiveModal: (modal: Modal | null) => {
                set({ activeModal: modal })
            },
            toggleDrawer: () => set((state) => ({drawerOpen: !state.drawerOpen}))
        }),
        {
            name: 'general-store',
        }
    )
)