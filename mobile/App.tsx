import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeBaseProvider } from "native-base";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HomeScreen } from "./screens/HomeScreen";
import "react-native-url-polyfill/auto";
import { ApiProvider } from "./shared/providers/ApiProvider";
import { LoginScreen } from "./screens/LoginScreen";
import { SplashScreen } from "./screens/SplashScreen";
import { useEffect } from "react";
import { useAuthStore } from "./shared/stores/auth";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Splash: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const queryClient = new QueryClient();

export default function App() {
  const { isLoading, getUser, isLogout, user } = useAuthStore();

  useEffect(() => {
    getUser();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <ApiProvider>
      <QueryClientProvider client={queryClient}>
        <NativeBaseProvider>
          <NavigationContainer>
            <Stack.Navigator>
              {!!user ? (
                <>
                  <Stack.Screen name="Home" component={HomeScreen} />
                </>
              ) : (
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{
                    title: "Log in",
                    animationTypeForReplace: isLogout ? "pop" : "push",
                  }}
                />
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </NativeBaseProvider>
      </QueryClientProvider>
    </ApiProvider>
  );
}
