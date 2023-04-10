import React from "react";
import { useLogin } from "../shared/hooks/useLogin";
import {
  Box,
  Button,
  FormControl,
  Input,
  ScrollView,
  useToast,
} from "native-base";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { LoginUserDTO } from "generated-api";

export const LoginScreen = () => {
  const login = useLogin();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserDTO>();
  const toast = useToast();
  const onSubmit: SubmitHandler<LoginUserDTO> = (data) =>
    login.mutate(data, {
      onError: (e: any) => {
        if (e.response.data.statusCode === 404) {
          toast.show({
            description: e.response.data.message,
            bgColor: "error.700",
            color: "error.50",
          });
        }
      },
    });

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      flex={1}
      p={5}
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box mb={5} w="full">
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl isInvalid={!!errors.email} mb={5}>
              <FormControl.Label>Email</FormControl.Label>
              <Input
                variant="outline"
                p={2}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
              />
              <FormControl.ErrorMessage>
                {errors.password?.type === "required" && "Email is required"}
              </FormControl.ErrorMessage>
            </FormControl>
          )}
          name="email"
          rules={{ required: true }}
        />

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl isInvalid={!!errors.password} mb={5}>
              <FormControl.Label>Password</FormControl.Label>
              <Input
                variant="outline"
                type="password"
                p={2}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
              />
              <FormControl.ErrorMessage>
                {errors.password?.type === "required" && "Password is required"}
              </FormControl.ErrorMessage>
            </FormControl>
          )}
          name="password"
          rules={{ required: true }}
        />
      </Box>

      <Button
        onPress={handleSubmit(onSubmit)}
        w="full"
        isLoading={login.isLoading}
      >
        Log in
      </Button>
    </ScrollView>
  );
};
