import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { SettingsForm } from '../../modules/settings/components/SettingsForm';
import { ProfilePictureForm } from '../../modules/settings/components/ProfilePictureForm';
import { useGetUser } from '../../modules/settings/hooks/useGetUser';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRemoveProfilePicture } from '../../modules/settings/hooks/useRemoveProfilePicture';
import { useState } from 'react';
import { UserDTORoleEnum } from 'generated-api';

const Settings = () => {
  const { data } = useGetUser();
  const user = data?.data;
  const removeProfilePicture = useRemoveProfilePicture();
  const {
    isOpen: editUserIsOpen,
    onOpen: editUserOnOpen,
    onClose: editUserOnClose,
  } = useDisclosure();
  const {
    isOpen: editProfilePictureIsOpen,
    onOpen: editProfilePictureOnOpen,
    onClose: editProfilePictureOnClose,
  } = useDisclosure();
  const {
    isOpen: removeProfilePictureIsOpen,
    onOpen: removeProfilePictureOnOpen,
    onClose: removeProfilePictureOnClose,
  } = useDisclosure();
  const [showProfilePictureActions, setShowProfilePictureActions] =
    useState(false);

  return !!user ? (
    <Flex align='center' flexDir='column'>
      <Box
        px='10'
        position='relative'
        onMouseOver={() => setShowProfilePictureActions(true)}
        onMouseOut={() => setShowProfilePictureActions(false)}
      >
        <Avatar name={user.username} size='2xl' src={user.imageUrl} />
        {showProfilePictureActions && (
          <>
            <Button
              onClick={editProfilePictureOnOpen}
              position='absolute'
              right='-1em'
            >
              <FontAwesomeIcon icon={faImage} size='lg' />
            </Button>
            <Button
              onClick={removeProfilePictureOnOpen}
              position='absolute'
              top='12'
              right='-1em'
            >
              <DeleteIcon />
            </Button>
          </>
        )}
      </Box>

      <Flex align='center' gap='2'>
        <Heading mb='2'>{user.username}</Heading>
        <Button onClick={editUserOnOpen}>
          <EditIcon />
        </Button>
      </Flex>
      <Text>
        {user.role}{' '}
        {user.role !== UserDTORoleEnum.Customer && (
          <Text>@ {data?.data.company?.name}</Text>
        )}
      </Text>
      <Text>{data?.data.email}</Text>

      <Modal isOpen={editUserIsOpen} onClose={editUserOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SettingsForm onClose={editUserOnClose} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={editProfilePictureIsOpen}
        onClose={editProfilePictureOnClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Profile Picture</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ProfilePictureForm onClose={editProfilePictureOnClose} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={removeProfilePictureIsOpen}
        onClose={removeProfilePictureOnClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Remove Profile Picture</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete remove your profile picture?{' '}
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              variant='ghost'
              onClick={removeProfilePictureOnClose}
            >
              Close
            </Button>
            <Button
              colorScheme='red'
              isLoading={removeProfilePicture.isLoading}
              onClick={() =>
                removeProfilePicture.mutate(undefined, {
                  onSettled: () => {
                    removeProfilePictureOnClose();
                  },
                })
              }
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  ) : (
    <></>
  );
};

export default Settings;
