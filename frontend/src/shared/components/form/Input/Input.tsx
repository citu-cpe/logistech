import type { FieldProps } from 'formik';
import {
  FormControl,
  FormLabel,
  Input as ChakraInput,
  FormErrorMessage,
  InputProps as ChakraInputProps,
  Checkbox,
  Box,
} from '@chakra-ui/react';

export interface InputProps {
  fieldProps: FieldProps;
  label?: string;
  disabled?: boolean;
}

export const Input = ({
  fieldProps: { field, form },
  label,
  disabled,
  ...props
}: InputProps & ChakraInputProps) => (
  <FormControl
    isInvalid={!!form.errors[props.name!] && !!form.touched[props.name!]}
    isRequired
    mb='4'
  >
    {props.type === 'checkbox' ? (
      <Checkbox {...field} defaultChecked={field.value}>
        {label}
      </Checkbox>
    ) : (
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
        <ChakraInput {...field} {...props} disabled={disabled} />
      </Box>
    )}
    <FormErrorMessage>{form.errors[props.name!] as string}</FormErrorMessage>
  </FormControl>
);
