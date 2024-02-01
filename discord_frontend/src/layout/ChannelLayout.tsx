import { Outlet } from "react-router-dom"
import { MobileSidebar } from "../components"

const ChannelLayout = () => {
  return (
    <>
      <MobileSidebar />
      <Outlet />
    </>
  )
}

export default ChannelLayout