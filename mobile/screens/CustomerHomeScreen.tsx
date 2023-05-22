import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ProductItemByStatusDTOStatusEnum,
  ProductItemLocationDTO,
} from "generated-api";
import {
  Actionsheet,
  Button,
  Flex,
  HamburgerIcon,
  Spacer,
  Text,
  useDisclose,
} from "native-base";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { HomeStackParamList } from "./HomeStackScreen";
import { StyleSheet, Image } from "react-native";
import * as Location from "expo-location";
import React, { useState, useEffect, useContext, useRef } from "react";
import { SocketContext } from "../shared/providers/SocketProvider";
import {
  IMAGE_SIZE,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
} from "../shared/constants/map";
import { useAuthStore } from "../shared/stores/auth";
import MapViewDirections from "react-native-maps-directions";
import { edgePadding } from "../shared/variables";
import { GOOGLE_MAPS_API_KEY } from "@env";

interface CustomerHomeScreenProps {
  navigation: NativeStackNavigationProp<HomeStackParamList, "Home", undefined>;
}

export const CustomerHomeScreen: React.FC<CustomerHomeScreenProps> = ({
  navigation,
}) => {
  const [location, setLocation] = useState<Location.LocationObject | undefined>(
    undefined
  );
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const socket = useContext(SocketContext);
  const { user } = useAuthStore();
  const mapViewRef = useRef<MapView>(null);

  const { isOpen, onOpen, onClose } = useDisclose();

  useEffect(() => {
    if (socket) {
      if (!socket.connected) {
        socket.connect();
      }

      socket.on("test", async (_data: ProductItemLocationDTO) => {
        // setLatitude(data.latitude);
        // setLongitude(data.longitude);
        console.log("getting location...");
        let location = await Location.getCurrentPositionAsync({});
        console.log("location:", location);
        setLocation(location);
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
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
        mapViewRef.current?.fitToSuppliedMarkers(["house", "truck"], {
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

      <Button
        position="absolute"
        bottom="2"
        right="2"
        zIndex={1000000}
        alignSelf="flex-end"
        onPress={onOpen}
        bg="blueGray.600"
        w="12"
        h="12"
      >
        <HamburgerIcon color="white" />
      </Button>

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content bg="blueGray.600">
          <Flex flexDir="row" mb="2" justifyContent="space-between">
            <Button
              bg="blueGray.700"
              onPress={() => {
                onClose();
                navigation.navigate("ProductItems", {
                  status:
                    ProductItemByStatusDTOStatusEnum.InTransitToStorageFacility,
                });
              }}
            >
              In Transit To Storage Facility
            </Button>

            <Spacer />

            <Button
              bg="blueGray.700"
              onPress={() => {
                onClose();
                navigation.navigate("ProductItems", {
                  status: ProductItemByStatusDTOStatusEnum.InTransitToBuyer,
                });
              }}
            >
              In Transit To Buyer
            </Button>

            <Spacer />

            <Button
              bg="blueGray.700"
              onPress={() => {
                onClose();
                navigation.navigate("ProductItems", {
                  status: ProductItemByStatusDTOStatusEnum.OnHold,
                });
              }}
            >
              On Hold
            </Button>

            <Spacer />

            <Button
              bg="blueGray.700"
              onPress={() => {
                onClose();
                navigation.navigate("ProductItems", {
                  status: ProductItemByStatusDTOStatusEnum.Complete,
                });
              }}
            >
              Complete
            </Button>

            <Spacer />

            <Button
              bg="blueGray.700"
              onPress={() => {
                onClose();
                navigation.navigate("ProductItems", {
                  status: ProductItemByStatusDTOStatusEnum.RedFlag,
                });
              }}
            >
              Red Flag
            </Button>
          </Flex>

          <Button
            bg="blueGray.700"
            onPress={() => {
              onClose();
              navigation.navigate("Commerce");
            }}
            w="full"
          >
            Commerce
          </Button>
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
          {longitude &&
            latitude &&
            user &&
            user.addressLatitude &&
            user.addressLongitude && (
              <>
                <MapViewDirections
                  origin={{ latitude, longitude }}
                  destination={{
                    latitude: user.addressLatitude,
                    longitude: user.addressLongitude,
                  }}
                  apikey={GOOGLE_MAPS_API_KEY ?? ""}
                  strokeWidth={5}
                  strokeColor="blue"
                />
                <Marker
                  coordinate={{
                    longitude: user.addressLongitude,
                    latitude: user.addressLatitude,
                  }}
                  identifier="house"
                >
                  <Image
                    source={require("./images/house.png")}
                    style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
                  />
                </Marker>
                <Marker
                  coordinate={{
                    longitude,
                    latitude,
                  }}
                  identifier="truck"
                >
                  <Image
                    source={require("./images/delivery-truck.png")}
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
