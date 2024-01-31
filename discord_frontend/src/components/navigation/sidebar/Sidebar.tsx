import { UserButton } from '@clerk/clerk-react'
import { Center, Button, Stack, useMantineColorScheme } from '@mantine/core'
import { IconArrowsJoin, IconPlus, IconMoon, IconSun } from '@tabler/icons-react'
import { useModal } from '../../../hooks/useModal'
import classes from './sidebar.module.css'

export const Sidebar = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const {openModal} = useModal('CreateServer')

  return (
    <div className={classes.navbar}>
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