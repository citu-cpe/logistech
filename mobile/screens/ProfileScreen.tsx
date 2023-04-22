import { UpdateUserDTO } from "generated-api";
import { Box, Button, FormControl, Input, Text } from "native-base";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useGetUser } from "../shared/hooks/useGetUser";
import { useLogout } from "../shared/hooks/useLogout";
import { useUpdateUser } from "../shared/hooks/userUpdateUser";

export const ProfileScreen = () => {
  const logout = useLogout();
  const { data } = useGetUser();
  const updateUser = useUpdateUser();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UpdateUserDTO>();

  useEffect(() => {
    if (data) {
      setValue("username", data.data.username);
      setValue("address", data.data.address);
    }
  }, [data]);

  const onSubmit: SubmitHandler<UpdateUserDTO> = (data) =>
    updateUser.mutate(data);

  return (
    <Box flex={1} bg="blueGray.700" px="2">
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={!!errors.username} mb={5}>
            <FormControl.Label>
              <Text color="white">Username</Text>
            </FormControl.Label>
            <Input
              variant="outline"
              p={2}
              color="white"
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              autoCapitalize="none"
            />
            <FormControl.ErrorMessage>
              {errors.username?.type === "required" && "Username is required"}
            </FormControl.ErrorMessage>
          </FormControl>
        )}
        name="username"
        rules={{ required: true }}
      />

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={!!errors.address} mb={5}>
            <FormControl.Label color="white">
              <Text color="white">Address</Text>
            </FormControl.Label>
            <Input
              variant="outline"
              color="white"
              p={2}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              autoCapitalize="none"
            />
            <FormControl.ErrorMessage>
              {errors.address?.type === "required" && "Address is required"}
            </FormControl.ErrorMessage>
          </FormControl>
        )}
        name="address"
        rules={{ required: true }}
      />
      <Button
        onPress={handleSubmit(onSubmit)}
        w="full"
        isLoading={updateUser.isLoading}
      >
        Update profile
      </Button>

      <Button
        w="full"
        my="2"
        onPress={() => logout.mutate()}
        isLoading={logout.isLoading}
      >
        Log out
      </Button>
    </Box>
  );
};
