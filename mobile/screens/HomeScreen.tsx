import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { Button, StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from "../App";
import { HELLO_WORLD_QUERY_KEY, useGetHelloWorld } from "./useGetHelloWorld";

export const HomeScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Home">) => {
  const { data } = useGetHelloWorld();
  const queryClient = useQueryClient();

  return (
    <View style={styles.container}>
      <Text>LogisTech</Text>
      <Text>Response: {data?.data}</Text>
      <Button
        onPress={() => navigation.navigate("Profile", { userId: "a;dlkj;als" })}
        title="Profile"
      />
      <Button
        onPress={() => queryClient.invalidateQueries(HELLO_WORLD_QUERY_KEY)}
        title="Reload"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
