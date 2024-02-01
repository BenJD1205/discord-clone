import { useEffect } from 'react'
import { ServerHeader } from './ServerHeader'
import { useServer } from '../../../hooks/graphql/server/useServer'
import { useNavigate, useParams } from 'react-router-dom'
import classes from './serverSidebar.module.css'

export const ServerSidebar = () => {

  const navigate = useNavigate()
  const { serverId, memberId, channelId } = useParams()
  const { textChannels, audioChannels, videoChannels, server, role, members } = useServer()

  useEffect(() => {
    if (!channelId && !memberId && textChannels.length) {
      navigate(`/servers/${serverId}/channels/TEXT/${textChannels[0]?.id}`)
    }
  })

  return (
    <nav className={classes.nav}>
      <ServerHeader />
    </nav>
  )
}