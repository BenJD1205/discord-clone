import { useEffect, useState } from 'react'
import { ServerHeader } from './ServerHeader'
import { useServer } from '../../../hooks/graphql/server/useServer'
import { useNavigate, useParams } from 'react-router-dom'
import classes from './serverSidebar.module.css'
import { ScrollArea, Stack } from '@mantine/core'
import { ServerSidebarSection } from './ServerSidebarSection'
import { ServerChannel } from './ServerChannel'
import { ChannelType } from '../../../gql/graphql'

export const ServerSidebar = () => {

  const navigate = useNavigate()
  const [activeMemberId, setActiveMemberId] = useState<number | null>(null)
  const [activeChannelId, setActiveChannelId] = useState<number | null>(null)
  const { serverId, memberId, channelId } = useParams()
  const { textChannels, audioChannels, videoChannels, server, role, members } = useServer()

  useEffect(() => {
    if (!channelId && !memberId && textChannels.length) {
      navigate(`/servers/${serverId}/channels/TEXT/${textChannels[0]?.id}`)
    }
  })

  useEffect(() => {
    if (memberId) {
      setActiveMemberId(parseInt(memberId))
      setActiveChannelId(null)
    }
    if (channelId) {
      setActiveMemberId(null)
      setActiveChannelId(parseInt(channelId))
    }
  },[channelId, memberId, textChannels])

  if (!server || !role) return null;

  return (
    <nav className={classes.nav}>
      <ServerHeader server={server} memberRole={role} />
      {/* Server Search */}
      <ScrollArea>
        {!!textChannels.length && <ServerSidebarSection sectionType='channels' channelType={ChannelType.Text} role={role} label='Text Channels' />}
        <Stack>
          {textChannels.map((channel) => (
            <ServerChannel key={channel?.id} channel={channel} isActive={activeChannelId === channel?.id} role={role} server={server} />
          ))}
        </Stack>
        {!!audioChannels.length && (
          <ServerSidebarSection sectionType='channels' channelType={ChannelType.Audio} role={role} label='Audio Channels' />
        )}
        <Stack>
          {audioChannels.map((channel) => (
            <ServerChannel key={channel?.id} channel={channel} isActive={activeChannelId === channel?.id} role={role} server={server} />
          ))}
        </Stack>  
         {!!videoChannels.length && (
          <ServerSidebarSection
            sectionType="channels"
            channelType={ChannelType.Video}
            role={role}
            label="Video Channels"
          />
        )}
        <Stack>
          {videoChannels.map((channel) => (
            <ServerChannel
              key={channel?.id}
              channel={channel}
              isActive={activeChannelId === channel?.id}
              role={role}
              server={server}
            />
          ))}
        </Stack>
      </ScrollArea>
    </nav>
  )
}