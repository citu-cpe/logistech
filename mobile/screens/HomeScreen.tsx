import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from "../App";

export const HomeScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Home">) => {
  return (
    <View style={styles.container}>
      <Text>LogisTech</Text>
      <Button
        onPress={() => navigation.navigate("Profile", { userId: "a;dlkj;als" })}
        title="Profile"
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
