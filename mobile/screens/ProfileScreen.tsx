import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from "../App";

export const ProfileScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "Profile">) => {
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <Text>Id: {route.params.userId}</Text>
      <Button onPress={() => navigation.navigate("Home")} title="Home" />
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
