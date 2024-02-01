import { useState } from 'react'
import { UserButton } from '@clerk/clerk-react'
import { useNavigate } from "react-router-dom"
import { Center, Button, Stack, useMantineColorScheme, Tooltip, UnstyledButton, rem, Image } from '@mantine/core'
import { IconArrowsJoin, IconPlus, IconMoon, IconSun } from '@tabler/icons-react'
import { useModal } from '../../../hooks/useModal'
import classes from './sidebar.module.css'
import { useServers } from '../../../hooks/graphql/server/useServers'

interface NavbarLinkProps {
  label: string
  active?: boolean
  imageUrl: string
  onClick?: () => void
}

function NavbarLink({ imageUrl, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right">
      <UnstyledButton
        onClick={onClick}
        data-active={active || undefined}
        style={{ borderRadius: rem(100) }}
      >
        <Image src={imageUrl} w={rem(50)} h={rem(50)} radius={100} />
      </UnstyledButton>
    </Tooltip>
  )
}

export const Sidebar = () => {
  const [active, setActive] = useState(0)
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const { openModal } = useModal('CreateServer')
  const { servers } = useServers()
  const navigate = useNavigate()
  const links = servers?.map((server, index) => (
    <NavbarLink
      label={server?.name}
      imageUrl={server.imageUrl}
      key={server.id}
      active={active === index}
      onClick={() => {
        setActive(index)
        navigate(`/servers/${server.id}`)
      }}
    />
  ))

  return (
    <div className={classes.navbar}>
      <Stack> 
        <Center>
          <Button className={classes.link} variant='subtle' radius={100} onClick={openModal}>
            <IconPlus radius={100} size="3rem" />
          </Button>
        </Center>
        <Center>
          <Button className={classes.link} variant='subtle' radius={100} onClick={() => {}}>
            <IconArrowsJoin radius={100} size="3rem" />
          </Button>
        </Center>
        <Stack justify="center" gap="md" mt="xl">
          {links}
        </Stack>
      </Stack>
      <Stack justify='center' align='center'>
        <Button variant='subtle' className={classes.link}  onClick={toggleColorScheme} radius={100} p={0}>
          {colorScheme === 'dark' ? (
            <IconMoon radius={100} size={20} />
          ): (
            <IconSun radius={100} size={20} />
          )}
        </Button>
        <UserButton />  
      </Stack>
    </div>
  )
}