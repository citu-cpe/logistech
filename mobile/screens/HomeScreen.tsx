import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { UserDTORoleEnum } from "generated-api";
import { useAuthStore } from "../shared/stores/auth";
import { CourierHomeScreen } from "./CourierHomeScreen";
import { CustomerHomeScreen } from "./CustomerHomeScreen";
import { HomeStackParamList } from "./HomeStackScreen";

export const HomeScreen = ({
  navigation,
}: NativeStackScreenProps<HomeStackParamList, "Home">) => {
  const { user } = useAuthStore();
  return user?.role === UserDTORoleEnum.Customer ? (
    <CustomerHomeScreen navigation={navigation} />
  ) : (
    <CourierHomeScreen navigation={navigation} />
  );
};
