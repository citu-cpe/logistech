import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export const bottomTabBarStyles: BottomTabNavigationOptions = {
  tabBarStyle: {
    backgroundColor: "#334155",
  },
  tabBarInactiveTintColor: "white",
  tabBarActiveTintColor: "#2dd4bf",
  headerStyle: {
    backgroundColor: "#334155",
  },
  headerTitleStyle: {
    color: "white",
  },
};

export const stackHeaderStyles: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: "#334155",
  },
  headerTitleStyle: {
    color: "white",
  },
  headerTintColor: "white",
  title: "",
};
