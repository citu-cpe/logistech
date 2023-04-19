import { forwardRef, useState } from 'react';

import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEvent } from 'react';
import { Box, Flex, FormLabel, Input, Text } from '@chakra-ui/react';

interface FileInputProps {
  name: string;
  id?: string;
  label?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  accept: string;
  hidden?: boolean;
  ref?: React.RefObject<HTMLInputElement>;
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  (
    { label, onChange, ...props }: FileInputProps,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const [labelBackground, setLabelBackground] = useState('gray.900');

    return (
      <Box position='relative' display='inline' overflow='hidden'>
        <FormLabel
          htmlFor={props.name}
          bg={labelBackground}
          w='full'
          rounded='md'
          cursor='pointer'
        >
          <Flex flexDir='column' align='center' gap='4' p='8'>
            <FontAwesomeIcon icon={faImage} size='2x' />
            <Box textAlign='center'>
              <Text>Click or drag to upload</Text>
              <Text color='gray.500'>Accepts {props.accept}</Text>
            </Box>
          </Flex>
        </FormLabel>
        <Input
          type='file'
          onChange={onChange}
          autoComplete='off'
          ref={ref}
          {...props}
          position='absolute'
          top='0'
          right='0'
          minW='full'
          minH='full'
          textAlign='right'
          filter='alpha(opacity=0)'
          opacity='0'
          outline='none'
          background='white'
          cursor='pointer'
          display='block'
          onMouseOver={() => setLabelBackground('gray.800')}
          onMouseOut={() => setLabelBackground('gray.900')}
        />
      </Box>
    );
  }
);

FileInput.displayName = 'FileInput';
