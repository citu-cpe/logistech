import { Box, Button } from "native-base";
import { useLogout } from "../shared/hooks/useLogout";

export const ProfileScreen = () => {
  const logout = useLogout();

  return (
    <Box flex={1} bg="blueGray.700" px="2">
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
