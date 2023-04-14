import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { stackHeaderStyles } from "../shared/styles/navigationStyles";
import { CartScreen } from "./CartScreen";

export type CartStackParamList = {
  Cart: undefined;
};

const CartStack = createNativeStackNavigator<CartStackParamList>();

export const CartStackScreen = () => {
  return (
    <CartStack.Navigator
      screenOptions={{
        ...stackHeaderStyles,
      }}
    >
      <CartStack.Screen name="Cart" component={CartScreen} />
    </CartStack.Navigator>
  );
};
