import { useGeneralStore } from '../stores/generalStore'
import type { Modal } from '../types/general'

export function useModal(modalType: Modal) {
    const activeModal = useGeneralStore((state) => state.activeModal)
    const setActiveModal = useGeneralStore((state) => state.setActiveModal)

    const isOpen = activeModal === modalType 
    const openModal = () => {
        setActiveModal(modalType)
    }
    const closeModal = () => {
        setActiveModal(null)
    }

    return {
        isOpen,
        openModal,
        closeModal
    }
}