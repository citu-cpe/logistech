import { StyleSheet, Text, View } from "react-native";

export const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Splash Screen...</Text>
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
