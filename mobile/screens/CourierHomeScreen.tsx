import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import {
  ProductItemDTOStatusEnum,
  ProductItemLocationDTO,
} from "generated-api";
import {
  Actionsheet,
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useDisclose,
} from "native-base";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CourierProductItemInTransit } from "../shared/components/CourierProductItemInTransit";
import { CourierProductItemToBePickedUp } from "../shared/components/CourierProductItemToBePickedUp";
import { ProductItemStatusBadge } from "../shared/components/ProductItemStatusBadge";
import {
  COURIER_PRODUCT_ITEMS,
  useGetCourierAssignedProductItems,
} from "../shared/hooks/useGetCourierAssignedProductItems";
import { HomeStackParamList } from "./HomeStackScreen";
import { StyleSheet, Image } from "react-native";
import { SocketContext } from "../shared/providers/SocketProvider";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  IMAGE_SIZE,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
} from "../shared/constants/map";
import MapViewDirections from "react-native-maps-directions";

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

  const [location, setLocation] = useState<Location.LocationObject | undefined>(
    undefined
  );
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const socket = useContext(SocketContext);

  const mapViewRef = useRef<MapView>(null);
  const edgePadding = 75;

  useEffect(() => {
    if (socket) {
      socket.on("test", (data: ProductItemLocationDTO) => {
        setLatitude(data.latitude);
        setLongitude(data.longitude);
      });
    }

    return () => {
      socket?.close();
    };
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    })();
  }, []);

  useEffect(() => {
    if (mapViewRef.current) {
      setTimeout(() => {
        mapViewRef.current?.fitToSuppliedMarkers(["home", "truck"], {
          animated: true,
          edgePadding: {
            top: edgePadding,
            right: edgePadding,
            bottom: edgePadding,
            left: edgePadding,
          },
        });
      }, 1000);
    }
  }, [mapViewRef.current]);

  return (
    <>
      <Text>{errorMsg}</Text>

      <Flex
        position="absolute"
        p={5}
        bg="blueGray.600"
        bottom="0"
        zIndex={1000000}
        flexDir="row"
        justifyContent="space-between"
        w="full"
      >
        <Button onPress={() => open(toBePickedUpOnOpen)} bg="blueGray.700">
          To Be Picked Up
        </Button>
        <Button onPress={() => open(inTransitOnOpen)} bg="blueGray.700">
          Current Delivery
        </Button>
      </Flex>

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

      {location && (
        <MapView
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          ref={mapViewRef}
        >
          {longitude && latitude && (
            <>
              <MapViewDirections
                origin={{ latitude: 10.2433, longitude: 123.789 }}
                destination={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                apikey={process.env.GOOGLE_MAPS_API_KEY ?? ""}
              />
              <Marker
                coordinate={{
                  latitude: 10.2433,
                  longitude: 123.789,
                }}
                identifier="truck"
              >
                <Image
                  source={require("./images/delivery-truck.png")}
                  style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
                />
              </Marker>
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                identifier="home"
              >
                <Image
                  source={require("./images/house.png")}
                  style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
                />
              </Marker>
            </>
          )}
        </MapView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
