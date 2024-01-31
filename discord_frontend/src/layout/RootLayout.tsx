import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useSession } from '@clerk/clerk-react'
import { useMutation } from '@apollo/client'
import { Sidebar } from '../components'
import { useProfileStore } from '../stores/profileStore'
import { CreateProfileMutation, CreateProfileMutationVariables } from '../gql/graphql'
import { CREATE_PROFILE } from '../graphql/mutations/CreateProfile'

const RootLayout = () => {
  const profile = useProfileStore((state) => state.profile)
  const setProfile = useProfileStore((state) => state.setProfile)
  const { session } = useSession()
  const [createProfile] = useMutation<CreateProfileMutation, CreateProfileMutationVariables>(CREATE_PROFILE, {})

  useEffect(() => {
    const createProfileFn = async () => {
      if (!session?.user) return 
      try {
        await createProfile({
          variables: {
            input: {
              email: session?.user.emailAddresses[0].emailAddress,
              name: session?.user.username || "",
              imageUrl: session?.user.imageUrl
            },
          },
          onCompleted: (data) => {
            setProfile(data.createProfile)
          },
        })
      }
      catch (err) {
        console.log("Error creating profile in backend",err)
      }
    }
    if(profile?.id) return 
    createProfileFn()
  },[session?.id])

  return (
    <>
        <Sidebar />
        <Outlet/>
    </>
  )
}

export default RootLayout