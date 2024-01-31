import { useNavigate, Routes, Route } from 'react-router-dom'
import {ClerkProvider} from '@clerk/clerk-react'
import RootLayout from '../layout/RootLayout'
import { ProtectedRoute, CreateServerModal } from '../components'
import Home from '../pages/Home'

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
            </Routes>
        </ClerkProvider>
    )
}

export default RouterComponent