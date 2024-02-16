import { Flex, Menu, Divider, Text } from '@mantine/core';
import {IconArrowAutofitDown, IconPlus, IconSettings, IconTrash, IconX } from '@tabler/icons-react';
import { Server, MemberRole } from '../../../gql/graphql';
import { useModal } from '../../../hooks/useModal';

export const ServerHeader = ({ server, memberRole }: {
  server: Server;
  memberRole: MemberRole;
}) => {

  const isAdmin = memberRole === MemberRole.Admin
  const isModerator = memberRole === MemberRole.Moderator || isAdmin
  const inviteModal = useModal('InvitePeople')
  const updateServerModal = useModal('UpdateServer')
  const createChannelModal = useModal('CreateChannel')
  const deleteChannelModal = useModal('DeleteChannel')

  return (
    <Menu shadow='md'>
      <Menu.Target>
        <Flex p="md" justify={'space-between'} align={'center'} w='100%' style={{ cursor: 'pointer' }}>
          {server?.name} <IconArrowAutofitDown />
        </Flex>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={inviteModal.openModal} rightSection={<IconPlus />}>Invite People</Menu.Item>
        {isAdmin && (
          <Menu.Item rightSection={<IconSettings />} onClick={updateServerModal.openModal}>
            Update Server
          </Menu.Item>
        )}
        {isModerator && (
          <Menu.Item rightSection={<IconPlus />} onClick={createChannelModal.openModal}>
            Create Channel
          </Menu.Item>
        )}
        {isModerator && <Divider />}
        {isAdmin && (
          <Menu.Item
            color="red"
            rightSection={<IconTrash />}
            onClick={deleteChannelModal.openModal}
          >
            <Text>Delete Server</Text>
          </Menu.Item>
        )}
        {!isAdmin && (
          <Menu.Item
            color="red"
            rightSection={<IconX />}
          >
            <Text>Leave Server</Text>
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  )
}