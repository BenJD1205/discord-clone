import { ServerSidebar } from '../components'
import { Outlet } from 'react-router-dom'


const ServerLayout = () => {
  return (
    <>
      <ServerSidebar />
      <Outlet />
    </>
  )
}

export default ServerLayout