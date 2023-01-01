import type { FieldProps } from 'formik';
import {
  FormControl,
  FormLabel,
  Select as ChakraSelect,
  FormErrorMessage,
  SelectProps as ChakraSelectProps,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

interface SelectProps {
  fieldProps: FieldProps;
  label?: string;
  children: ReactNode;
}

export const Select = ({
  fieldProps: { field, form },
  label,
  children,
  ...props
}: SelectProps & ChakraSelectProps) => (
  <FormControl
    isInvalid={!!form.errors[props.name!] && !!form.touched[props.name!]}
    isRequired
    mb='4'
  >
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
    <ChakraSelect {...field} {...props}>
      {children}
    </ChakraSelect>
    <FormErrorMessage>{form.errors[props.name!] as string}</FormErrorMessage>
  </FormControl>
);
