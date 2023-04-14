import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProductItemByStatusDTOStatusEnum } from "generated-api";
import { Button, Flex, Heading, ScrollView, Spacer } from "native-base";
import { HomeStackParamList } from "./HomeStackScreen";

export const HomeScreen = ({
  navigation,
}: NativeStackScreenProps<HomeStackParamList, "Home">) => {
  return (
    <ScrollView
      flex={1}
      p={5}
      backgroundColor="blueGray.700"
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Flex flexDir="row" mb="2">
        <Button
          onPress={() =>
            navigation.navigate("ProductItems", {
              status: ProductItemByStatusDTOStatusEnum.InTransit,
            })
          }
        >
          In Transit
        </Button>

        <Spacer />

        <Button
          onPress={() =>
            navigation.navigate("ProductItems", {
              status: ProductItemByStatusDTOStatusEnum.OnHold,
            })
          }
        >
          On Hold
        </Button>

        <Spacer />

        <Button
          onPress={() =>
            navigation.navigate("ProductItems", {
              status: ProductItemByStatusDTOStatusEnum.RedFlag,
            })
          }
        >
          Red Flag
        </Button>
      </Flex>

      <Button onPress={() => navigation.navigate("Commerce")} w="full">
        Commerce
      </Button>
    </ScrollView>
  );
};
