import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeBaseProvider, StatusBar } from "native-base";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-native-url-polyfill/auto";
import { ApiProvider } from "./shared/providers/ApiProvider";
import { LoginScreen } from "./screens/LoginScreen";
import { SplashScreen } from "./screens/SplashScreen";
import { useEffect } from "react";
import { useAuthStore } from "./shared/stores/auth";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HistoryScreen } from "./screens/HistoryScreen";
import { ReturnsScreen } from "./screens/ReturnsScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { HomeStackScreen } from "./screens/HomeStackScreen";
import { CartStackScreen } from "./screens/CartStackScreen";
import {
  bottomTabBarStyles,
  stackHeaderStyles,
} from "./shared/styles/navigationStyles";
import { UserDTORoleEnum } from "generated-api";
import { SocketProvider } from "./shared/providers/SocketProvider";

export type RootStackParamList = {
  Login: undefined;
};

export type RootTabParamList = {
  HomeStack: undefined;
  CartStack: undefined;
  History: undefined;
  Returns: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const queryClient = new QueryClient();

export default function App() {
  const { isLoading, getUser, isLogout, user } = useAuthStore();
  const isCustomer = user?.role === UserDTORoleEnum.Customer;

  useEffect(() => {
    getUser();
  }, []);

  return (
    <NativeBaseProvider>
      <ApiProvider>
        <QueryClientProvider client={queryClient}>
          <SocketProvider>
            <StatusBar barStyle="light-content" />
            {isLoading ? (
              <SplashScreen />
            ) : (
              <NavigationContainer>
                {!!user ? (
                  <>
                    <Tab.Navigator
                      screenOptions={{
                        ...bottomTabBarStyles,
                      }}
                    >
                      <Tab.Screen
                        name="HomeStack"
                        component={HomeStackScreen}
                        options={{
                          tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons
                              name="home"
                              color={color}
                              size={size}
                            />
                          ),
                          title: "Home",
                          headerShown: false,
                        }}
                      />
                      {isCustomer && (
                        <>
                          <Tab.Screen
                            name="CartStack"
                            component={CartStackScreen}
                            options={{
                              tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons
                                  name="cart"
                                  color={color}
                                  size={size}
                                />
                              ),
                              title: "Cart",
                              headerShown: false,
                            }}
                          />
                          <Tab.Screen
                            name="History"
                            component={HistoryScreen}
                            options={{
                              tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons
                                  name="history"
                                  color={color}
                                  size={size}
                                />
                              ),
                            }}
                          />
                          <Tab.Screen
                            name="Returns"
                            component={ReturnsScreen}
                            options={{
                              tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons
                                  name="keyboard-return"
                                  color={color}
                                  size={size}
                                />
                              ),
                            }}
                          />
                        </>
                      )}
                      <Tab.Screen
                        name="Profile"
                        component={ProfileScreen}
                        options={{
                          tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons
                              name="account"
                              color={color}
                              size={size}
                            />
                          ),
                        }}
                      />
                    </Tab.Navigator>
                  </>
                ) : (
                  <Stack.Navigator
                    screenOptions={{
                      ...stackHeaderStyles,
                    }}
                  >
                    <Stack.Screen
                      name="Login"
                      component={LoginScreen}
                      options={{
                        title: "Log in",
                        animationTypeForReplace: isLogout ? "pop" : "push",
                      }}
                    />
                  </Stack.Navigator>
                )}
              </NavigationContainer>
            )}
          </SocketProvider>
        </QueryClientProvider>
      </ApiProvider>
    </NativeBaseProvider>
  );
}
