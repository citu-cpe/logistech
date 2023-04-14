import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Heading } from "native-base";
import { stackHeaderStyles } from "../shared/styles/navigationStyles";
import { CommerceScreen } from "./CommerceScreen";
import { HomeScreen } from "./HomeScreen";
import {
  ProductItemsScreen,
  ProductItemsScreenProps,
} from "./ProductItemsScreen";

export type HomeStackParamList = {
  Home: undefined;
  ProductItems: ProductItemsScreenProps;
  Commerce: undefined;
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStackScreen = () => {
  return (
    <>
      <HomeStack.Navigator
        screenOptions={{
          ...stackHeaderStyles,
        }}
      >
        <HomeStack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerLeft: () => <Heading color="white">LogisTech</Heading>,
          }}
        />
        <HomeStack.Screen name="ProductItems" component={ProductItemsScreen} />
        <HomeStack.Screen name="Commerce" component={CommerceScreen} />
      </HomeStack.Navigator>
    </>
  );
};
