import { EditIcon } from '@chakra-ui/icons';
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
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { SettingsForm } from '../../modules/settings/components/SettingsForm';
import { useGetUser } from '../../modules/settings/hooks/useGetUser';

const Settings = () => {
  const { data } = useGetUser();
  const user = data?.data;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return !!user ? (
    <Box>
      <Avatar name={user.username} size='2xl' />

      <Flex align='center' gap='2'>
        <Heading mb='2'>{user.username}</Heading>
        <Button onClick={onOpen}>
          <EditIcon />
        </Button>
      </Flex>
      <Text>
        {user.role} @ {data?.data.company?.name}
      </Text>
      <Text>{data?.data.email}</Text>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SettingsForm onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  ) : (
    <></>
  );
};

export default Settings;
