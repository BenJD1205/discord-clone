import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Modal } from '../types/general'
import { ChannelType } from '../gql/graphql'

interface GeneralStore {
    activeModal: Modal | null
    drawerOpen: boolean
    channelTypeForCreateChannelModal: ChannelType
    channelToBeDeletedOrUpdatedId: number | null
    setActiveModal: (modal: Modal | null) => void
    toggleDrawer: () => void
    setChannelTypeForCreateChannelModal: (type: ChannelType | undefined) => void
    setChannelToBeDeletedOrUpdatedId: (id: number | null) => void
}

export const useGeneralStore = create<GeneralStore>()(
    persist(
        (set) => ({
            activeModal: null,
            drawerOpen: false,
            channelTypeForCreateChannelModal: ChannelType.Text,
            channelToBeDeletedOrUpdatedId: null,
            setActiveModal: (modal: Modal | null) => {
                set({ activeModal: modal })
            },
            toggleDrawer: () => set((state) => ({ drawerOpen: !state.drawerOpen })),
            setChannelTypeForCreateChannelModal: (type) => set(() => ({
                channelTypeForCreateChannelModal: type
            })),
            setChannelToBeDeletedOrUpdatedId: (id) =>
            set(() => ({ channelToBeDeletedOrUpdatedId: id })),
        }),
        {
            name: 'general-store',
        }
    )
)