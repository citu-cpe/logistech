import { Box, Button, Text } from "native-base";
import { useLogout } from "../shared/hooks/useLogout";

export const HomeScreen = () => {
  const logout = useLogout();

  return (
    <Box flex={1} justifyContent="center" alignItems="center" p={5}>
      <Text mb={5}>LogisTech</Text>
      <Button
        w="full"
        onPress={() => logout.mutate()}
        isLoading={logout.isLoading}
      >
        Log out
      </Button>
    </Box>
  );
};
