import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  NumberInput as ChakraNumberInput,
  NumberInputProps,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
  Box,
} from '@chakra-ui/react';
import type { InputProps } from '../Input/Input';

export const NumberInput = ({
  fieldProps: { field, form },
  label,
  ...props
}: InputProps & NumberInputProps) => (
  <FormControl
    isInvalid={!!form.errors[props.name!] && !!form.touched[props.name!]}
    isRequired
    mb='4'
  >
    <Box>
      {!!label && (
        <FormLabel
          htmlFor={props.id}
          mb='2'
          color='white.900'
          fontWeight='semibold'
        >
          {label}
        </FormLabel>
      )}
      <ChakraNumberInput {...field} {...props}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </ChakraNumberInput>
    </Box>
    <FormErrorMessage>{form.errors[props.name!] as string}</FormErrorMessage>
  </FormControl>
);
