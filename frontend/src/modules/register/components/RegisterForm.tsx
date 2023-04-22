import { Input } from '../../../shared/components/form/Input/Input';
import * as Yup from 'yup';
import NextLink from 'next/link';
import { FieldProps, Field, Form, Formik } from 'formik';
import React from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import { useRegister } from '../hooks/useRegister';
import { RegisterUserDTO, RegisterUserDTORoleEnum } from 'generated-api';

export const RegisterForm = () => {
  const mutation = useRegister();

  const onSubmit = (registerDTO: RegisterUserDTO) => {
    mutation.mutate(registerDTO);
  };

  const initialValues = {
    email: '',
    username: '',
    password: '',
    address: '',
    role: RegisterUserDTORoleEnum.Customer,
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    username: Yup.string().required('Required'),
    password: Yup.string()
      .min(4, 'Password must be at least 4 characters')
      .required('Required'),
    role: Yup.string().required('Required'),
  });

  return (
    <Box bg='gray.700' p='8' borderRadius='md' w='xl'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {() => (
          <Form noValidate>
            <Box mb='4'>
              <Field name='username'>
                {(fieldProps: FieldProps<string, RegisterUserDTO>) => (
                  <Input
                    fieldProps={fieldProps}
                    name='username'
                    label='Username'
                    type='text'
                    id='username'
                    borderColor='gray.300'
                    bgColor='gray.50'
                    color='gray.800'
                  />
                )}
              </Field>
              <Field name='email' type='email'>
                {(fieldProps: FieldProps<string, RegisterUserDTO>) => (
                  <Input
                    fieldProps={fieldProps}
                    name='email'
                    label='Email'
                    type='email'
                    id='email'
                    borderColor='gray.300'
                    bgColor='gray.50'
                    color='gray.800'
                  />
                )}
              </Field>
              <Field name='password' type='password'>
                {(fieldProps: FieldProps<string, RegisterUserDTO>) => (
                  <Input
                    fieldProps={fieldProps}
                    name='password'
                    label='Password'
                    type='password'
                    id='password'
                    borderColor='gray.300'
                    bgColor='gray.50'
                    color='gray.800'
                  />
                )}
              </Field>
              {/* FIXME */}
              {/* <Field name='role'> */}
              {/*   {( */}
              {/*     fieldProps: FieldProps< */}
              {/*       RegisterUserDTORoleEnum, */}
              {/*       RegisterUserDTO */}
              {/*     > */}
              {/*   ) => ( */}
              {/*     <Select */}
              {/*       fieldProps={fieldProps} */}
              {/*       name='role' */}
              {/*       label='Role' */}
              {/*       id='role' */}
              {/*       borderColor='gray.300' */}
              {/*       bgColor='gray.50' */}
              {/*       color='gray.800' */}
              {/*     > */}
              {/*       <option selected hidden disabled value=''> */}
              {/*         Choose a company type */}
              {/*       </option> */}
              {/*       <option value={CompanyDTOTypeEnum.Courier}>Courier</option> */}
              {/*       <option value={CompanyDTOTypeEnum.Customer}> */}
              {/*         Customer */}
              {/*       </option> */}
              {/*       <option value={CompanyDTOTypeEnum.Retailer}> */}
              {/*         Retailer */}
              {/*       </option> */}
              {/*       <option value={CompanyDTOTypeEnum.Manufacturer}> */}
              {/*         Manufacturer */}
              {/*       </option> */}
              {/*       <option value={CompanyDTOTypeEnum.StorageFacility}> */}
              {/*         Storage Facility */}
              {/*       </option> */}
              {/*       <option value={CompanyDTOTypeEnum.Supplier}> */}
              {/*         Supplier */}
              {/*       </option> */}
              {/*     </Select> */}
              {/*   )} */}
              {/* </Field> */}
            </Box>
            <Box mb='4'>
              <Button
                data-cy='register-submit-btn'
                formNoValidate
                type='submit'
                isLoading={mutation.isLoading}
                width='full'
                bgColor='gray.800'
                color='gray.50'
                _hover={{ bgColor: 'gray.800', color: 'gray.50' }}
              >
                Register
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
      <Flex justify='right' color='gray.500'>
        <NextLink href='/login' passHref>
          Log In
        </NextLink>
      </Flex>
    </Box>
  );
};
