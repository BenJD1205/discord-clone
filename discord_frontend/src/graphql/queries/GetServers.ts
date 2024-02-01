import { gql } from "@apollo/client"

export const GET_SERVERS = gql`
  query GetServers(profileId: $profileId) {
    getServers {
      id
      name
      imageUrl
    }
  }
`