import { Box, Button, Image } from '@chakra-ui/react';
import { useGetUser } from '../hooks/useGetUser';
import * as Yup from 'yup';
import { FileInput } from '../../../shared/components/form/FileInput/FileInput';
import { useAxios } from '../../../shared/hooks/useAxios';
import { ChangeEvent, useRef, useState } from 'react';
import { CloseIcon } from '@chakra-ui/icons';

interface ProfilePictureFormProps {
  onClose?: () => void;
}

export const profilePictureFormValidationSchema = Yup.object({
  username: Yup.string().required('Required'),
});

export const ProfilePictureForm: React.FC<ProfilePictureFormProps> = ({
  onClose,
}) => {
  const { data } = useGetUser();
  const axios = useAxios();
  const imagePreviewRef = useRef<HTMLImageElement>(null);
  const imagePreviewDivRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState(new FormData());
  const [uploadPictureIsLoading, setUploadPictureIsLoading] = useState(false);
  const [showInput, setShowInput] = useState(true);

  const onProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const profilePicture = e.target.files[0];
      const fileReader = new FileReader();
      if (e.target.files[0] && imagePreviewDivRef.current) {
        imagePreviewDivRef.current.style.display = 'block';
        setShowInput(false);
        fileReader.readAsDataURL(e.target.files[0]);
        fileReader.onload = (event) => {
          if (imagePreviewRef.current) {
            imagePreviewRef.current.src = event.target?.result as string;
          }
        };
      }

      const newFormData = new FormData();
      newFormData.append('profilePicture', profilePicture);
      setFormData(newFormData);
    } else {
      resetImagePreview();
    }
  };

  const resetImagePreview = () => {
    setFormData(new FormData());
    setShowInput(true);
    if (imagePreviewDivRef.current) {
      imagePreviewDivRef.current.style.display = 'none';
    }
    if (imagePreviewRef.current) {
      imagePreviewRef.current.src = '';
    }
  };

  const onSave = async () => {
    setUploadPictureIsLoading(true);
    await axios.post('/user/profile-picture', formData);
    setUploadPictureIsLoading(false);

    if (onClose) {
      onClose();
    }
  };

  return data?.data ? (
    <Box>
      <Box>
        <Box ref={imagePreviewDivRef} mb='4' position='relative'>
          <Image ref={imagePreviewRef} alt='' rounded='md' />
          {!showInput && (
            <Button
              position='absolute'
              top='2'
              right='2'
              bg='gray.800'
              _hover={{ background: 'gray.600' }}
              onClick={() => {
                resetImagePreview();
              }}
            >
              <CloseIcon />
            </Button>
          )}
        </Box>

        {showInput && (
          <FileInput
            name='profilePicture'
            id='profilePicture'
            accept='.jpg, .jpeg, .png'
            onChange={onProfilePictureChange}
          />
        )}
      </Box>

      <Box mb='4'>
        <Button
          formNoValidate
          isLoading={uploadPictureIsLoading}
          bgColor='gray.800'
          color='gray.50'
          width='full'
          _hover={{ bgColor: 'gray.800', color: 'gray.50' }}
          disabled={showInput}
          onClick={onSave}
        >
          Save
        </Button>
      </Box>
    </Box>
  ) : (
    <></>
  );
};
