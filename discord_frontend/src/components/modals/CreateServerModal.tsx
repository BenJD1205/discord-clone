import { useState } from "react";
import { Modal, Text, Stack, Flex, Group, rem, Button, Image, TextInput } from "@mantine/core";
import { useMutation } from "@apollo/client";
import { CREATE_SERVER } from "../../graphql/mutations/server/CreateServer";
import { useProfileStore } from "../../stores/profileStore";
import { CreateServerMutation, CreateServerMutationVariables } from "../../gql/graphql";
import { Dropzone, IMAGE_MIME_TYPE, DropzoneProps } from '@mantine/dropzone'
import { useForm } from '@mantine/form'
import {IconUpload, IconX} from '@tabler/icons-react'
import classes from './createServerModal.module.css'
import { useModal } from "../../hooks/useModal";

export const CreateServerModal = () => {
    const [file, setFile] = useState<File | null>(null)
    const [imgPreview, setImgPreview] = useState<string | null>(null)
    const { isOpen, closeModal } = useModal('CreateServer')
    const profileId = useProfileStore((state) => state.profile?.id)
    const form = useForm({
        initialValues: {
            name:'',
        },
        validate: {
            name:(value) => !value.trim() && 'Please enter a name'
        }
    })
    const [createServer, {loading, error}] = useMutation<
    CreateServerMutation,
    CreateServerMutationVariables>(CREATE_SERVER)
    
    const onSubmit = () => {
    if (!form.validate()) return

    createServer({
      variables: {
        input: {
          name: form.values.name,
          profileId,
        },
        file,
      },
      onCompleted: () => {
        setImgPreview(null)
        setFile(null)
        form.reset
        closeModal()
      },

      refetchQueries: ["GetServers"],
    })
  }

    const handleDropzoneChange: DropzoneProps["onDrop"] = (files) => {
        if (files.length === 0) {
            return setImgPreview(null)
        }
        const reader = new FileReader()
        reader.onload = (e) => {
            setImgPreview(e.target?.result as string)
        }
        setFile(files[0])
        reader.readAsDataURL(files[0])
    }

    return <Modal title='Create a server' opened={isOpen} onClose={closeModal}>
        <Text c='dimmed'>
            Give your sever a personality with a name and an image. You can always change it later.
        </Text>
        <form onSubmit={form.onSubmit(() => onSubmit())}>
            <Stack>
                <Flex justify='center' align='center' direction={'column'}>
                    <Stack style={{width:'100%'}}>
                        <Flex justify='center' align='center' direction={'column'}>
                            {!imgPreview && (
                                <Dropzone onDrop={(files) => handleDropzoneChange(files)} className={classes.dropzone} accept={IMAGE_MIME_TYPE} mt='md'>
                                    <Group>
                                        <Dropzone.Accept>
                                            <IconUpload size="3.2rem" stroke={1.5}  />
                                        </Dropzone.Accept>
                                        <Dropzone.Reject>
                                            <IconX size="3.2rem" stroke={1.5}  />
                                        </Dropzone.Reject>
                                        <Dropzone.Idle>
                                            <IconUpload size="3.2rem" stroke={1.5}  />
                                        </Dropzone.Idle>
                                        <Stack>
                                            <Text size="xl" inline>
                                                Drag images here or click to select files 
                                            </Text>
                                            <Text size="sm" c="dimmed" inline mt={7}>
                                                Upload a server icon
                                            </Text>
                                            {error?.message && !file && (
                                                <Text c="red">{error?.message}</Text>
                                            )}
                                        </Stack>
                                    </Group>
                                </Dropzone>
                            )}
                            {imgPreview && (
                                <Flex pos='relative' w={rem(150)} h={rem(150)} mt='md'>
                                    <>
                                        <Button
                                            onClick={() => setImgPreview(null)}
                                            color='red'
                                            pos='absolute'
                                            style={{
                                                zIndex: 1,
                                                borderRadius: '50%',
                                                padding: 0,
                                                width: rem(30),
                                                height: rem(30),
                                                top: 0,
                                                right:10,
                                            }}
                                        >
                                            <IconX color="white" />
                                        </Button>
                                        <Image src={imgPreview} width={rem(150)} height={rem(150)} radius={"50%"} />
                                    </>
                                </Flex>
                            )}
                        </Flex>
                        <TextInput label='Server name' placeholder="Enter server name" {...form.getInputProps("name")} error={form.errors.name} />
                        <Button disabled={!!form.errors.name || loading} w={'30%'} type="submit" variant="gradient" mt="md">Create Server</Button>
                    </Stack>
                </Flex>
            </Stack>
        </form>
    </Modal>
}

