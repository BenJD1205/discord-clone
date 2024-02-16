import React from "react"
import { useModal } from "../../../hooks/useModal"
import { Button, Modal, Text } from "@mantine/core"
import { useServer } from "../../../hooks/graphql/server/useServer"
import { useMutation } from "@apollo/client"
import {
  DeleteServerMutation,
  DeleteServerMutationVariables,
} from "../../../gql/graphql"
import { useNavigate } from "react-router-dom"
import { DELETE_SERVER } from "../../../graphql/mutations/server/DeleteServer"

function DeleteServerModal() {
  const { isOpen, closeModal } = useModal("DeleteServer")
  const { server } = useServer()

  const [deleteChannel, { loading }] = useMutation<
    DeleteServerMutation,
    DeleteServerMutationVariables
  >(DELETE_SERVER, {
    variables: {
      serverId: server?.id,
    },
    refetchQueries: ["GetServers"],
    onCompleted: () => {
      closeModal()
      navigate("/")
    },
  })
  const navigate = useNavigate()

  return (
    <Modal opened={isOpen} onClose={closeModal} title="Delete Server">
      <Text fw={700}>Are you sure you want to delete this server?</Text>
      <Button
        mt="md"
        loading={loading}
        color="red"
        onClick={() => deleteChannel()}
      >
        Delete Server
      </Button>
    </Modal>
  )
}

export default DeleteServerModal