import { Flex, Tooltip, Text } from '@mantine/core'
import {IconPlus, IconSettings} from '@tabler/icons-react'
import { ChannelType, MemberRole } from '../../../gql/graphql'
import { useModal } from '../../../hooks/useModal'
import { useGeneralStore } from '../../../stores/generalStore'

interface ServerSidebarSectionProps{
  sectionType: 'channels' | 'members'
  channelType: ChannelType
  role: MemberRole
  label: string
}

export const ServerSidebarSection = ({
  sectionType,
  channelType,
  role,
  label,
}: ServerSidebarSectionProps) => {

  const channelModal = useModal('CreateChannel')
  const manageMembersModal = useModal('ManageMembers')

  const setChannelTypeForCreateChannelModal = useGeneralStore((state) => state.setChannelTypeForCreateChannelModal)

  const handleOnClick = () => {
    setChannelTypeForCreateChannelModal(channelType)
    channelModal.openModal()
  }

  if (role !== MemberRole.Guest && sectionType === 'channels') {
    return (
      <Tooltip label='Create Channel' withArrow onClick={handleOnClick}>
        <Flex p="md" style={{ cursor: 'pointer' }}>
          <Flex justify={'space-between'} w='100%'>
            <Text fw={700}>{label}</Text>
          </Flex>
          <IconPlus />
        </Flex>
      </Tooltip>
    )
  }
  
  if (role !== MemberRole.Admin && sectionType === 'members') {
    return (
      <Tooltip label='Manage Members' withArrow onClick={manageMembersModal.openModal}>
        <Flex p="md" style={{ cursor: 'pointer' }}>
          <Flex justify={'space-between'} w='100%'>
            <Text fw={700}>{label}</Text>
          </Flex>
          <IconSettings />
        </Flex>
      </Tooltip>
    )
  }

  return (
    <div>ServerSidebarSection</div>
  )
}
