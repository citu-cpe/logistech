import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { ProductItemDTOStatusEnum } from "generated-api";
import {
  Actionsheet,
  Box,
  Button,
  Heading,
  Text,
  useDisclose,
} from "native-base";
import React from "react";
import { CourierProductItemInTransit } from "../shared/components/CourierProductItemInTransit";
import { CourierProductItemToBePickedUp } from "../shared/components/CourierProductItemToBePickedUp";
import { ProductItemStatusBadge } from "../shared/components/ProductItemStatusBadge";
import {
  COURIER_PRODUCT_ITEMS,
  useGetCourierAssignedProductItems,
} from "../shared/hooks/useGetCourierAssignedProductItems";
import { HomeStackParamList } from "./HomeStackScreen";

interface CourierHomeScreenProps {
  navigation: NativeStackNavigationProp<HomeStackParamList, "Home", undefined>;
}

export const CourierHomeScreen: React.FC<CourierHomeScreenProps> = ({}) => {
  const { data } = useGetCourierAssignedProductItems();
  const {
    isOpen: inTransitIsOpen,
    onOpen: inTransitOnOpen,
    onClose: inTransitOnClose,
  } = useDisclose();
  const {
    isOpen: toBePickedUpIsOpen,
    onOpen: toBePickedUpOnOpen,
    onClose: toBePickedUpOnClose,
  } = useDisclose();
  const queryClient = useQueryClient();

  const open = (onOpen: () => void) => {
    queryClient.invalidateQueries(COURIER_PRODUCT_ITEMS);
    onOpen();
  };

  return (
    <Box flex={1} p={5} bg="blueGray.700">
      <Button onPress={() => open(toBePickedUpOnOpen)}>To Be Picked Up</Button>
      <Button onPress={() => open(inTransitOnOpen)}>Current Delivery</Button>

      <Actionsheet isOpen={toBePickedUpIsOpen} onClose={toBePickedUpOnClose}>
        <Actionsheet.Content bg="blueGray.700">
          <Box w="full">
            <Heading color="white">To Be Picked Up</Heading>
            {data?.data.toBePickedUpProductItems.map((p) => (
              <CourierProductItemToBePickedUp key={p.id} productItem={p} />
            ))}

            {data?.data.toBePickedUpProductItems.length === 0 && (
              <Text color="white" textAlign="center" mt="2">
                No{" "}
                <ProductItemStatusBadge
                  status={ProductItemDTOStatusEnum.ToBePickedUp}
                />{" "}
                product items
              </Text>
            )}
          </Box>
        </Actionsheet.Content>
      </Actionsheet>

      <Actionsheet isOpen={inTransitIsOpen} onClose={inTransitOnClose}>
        <Actionsheet.Content bg="blueGray.700">
          <Box w="full">
            <Heading color="white">In Transit</Heading>
            {data?.data.inTransitProductItems.map((p) => (
              <CourierProductItemInTransit key={p.id} productItem={p} />
            ))}

            {data?.data.inTransitProductItems.length === 0 && (
              <Text color="white" textAlign="center" mt="2">
                No{" "}
                <ProductItemStatusBadge
                  status={ProductItemDTOStatusEnum.InTransit}
                />{" "}
                product items
              </Text>
            )}
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
    </Box>
  );
};
