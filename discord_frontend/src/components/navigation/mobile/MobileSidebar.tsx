import { Drawer, rem } from "@mantine/core"
import { Sidebar } from "../sidebar/Sidebar"
import { ServerSidebar } from "../server/ServerSidebar"
import { useGeneralStore } from "../../../stores/generalStore"

export const MobileSidebar = () => {

    const {drawerOpen, toggleDrawer} = useGeneralStore((state) => state)

  return (
    <>
        <Sidebar />
        <Drawer
            padding="0"
            mb="0"
            zIndex={10}
            onClose={toggleDrawer}
            opened={drawerOpen}
            size={rem(320)}
            position={"left"}
            withOverlay={false}
            styles={{ root: { width: 0, height: 0, position: "fixed" } }}
            withCloseButton={false}
            ml={rem(80)}
        >
            <ServerSidebar />
        </Drawer>
    </>
  )
}
