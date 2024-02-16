import { useNavigate, Routes, Route } from 'react-router-dom'
import {ClerkProvider} from '@clerk/clerk-react'
import RootLayout from '../layout/RootLayout'
import ServerLayout from '../layout/ServerLayout'
import ChannelLayout from '../layout/ChannelLayout'
import { ProtectedRoute, CreateServerModal, CreateChannelModal, InviteModal, DeleteChannelModal } from '../components'
import Home from '../pages/Home'
import Channel from '../pages/Channel'
import UpdateServerModal from '../components/modals/server/UpdateServer'

const RouterComponent = () => {
    const navigate = useNavigate()
    const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

    if (!PUBLISHABLE_KEY) {
        throw new Error("Missing Publishable Key")
    }

    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} navigate={(to) => navigate(to)}>
            <Routes>
                <Route path='' element={<RootLayout />}>
                    <Route
                        index
                        element={
                            <ProtectedRoute>
                                <CreateServerModal/> 
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                </Route>
                <Route path="servers/:serverId" element={<ServerLayout />}>
                    <Route
                        index
                        element={
                        <ProtectedRoute>
                            <CreateChannelModal />
                        </ProtectedRoute>
                        }
                    />
                </Route>
                <Route
          path="servers/:serverId/channels/:channelType/:channelId"
          element={<ChannelLayout />}
        >
          <Route
            index
            element={
              <ProtectedRoute>
                <DeleteChannelModal />
                <UpdateServerModal />
                <CreateChannelModal />
                <InviteModal />
                <Channel />    
              </ProtectedRoute>
            }
          />
        </Route>
            </Routes>
        </ClerkProvider>
    )
}

export default RouterComponent