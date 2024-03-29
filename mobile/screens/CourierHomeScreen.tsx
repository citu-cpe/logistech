import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import {
  ProductItemDTO,
  ProductItemDTOStatusEnum,
  ProductItemLocationDTO,
  ScanRfidDTO,
  UserDTO,
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
import { CompanyDTO } from "generated-api";
import { edgePadding } from "../shared/variables";
import { GOOGLE_MAPS_API_KEY } from "@env";
import { useAuthStore } from "../shared/stores/auth";

interface Directions {
  origin: CourierDirections;
  destination: CourierDirections;
}

interface CourierDirections {
  latitude: number;
  longitude: number;
}

interface CourierHomeScreenProps {
  navigation: NativeStackNavigationProp<HomeStackParamList, "Home", undefined>;
}

export const CourierHomeScreen: React.FC<CourierHomeScreenProps> = ({}) => {
  const { data } = useGetCourierAssignedProductItems((data) => {
    const inTransitProductItems = [
      ...(data?.data.inTransitToStorageFacilityProductItems ?? []),
      ...(data?.data.inTransitToBuyerProductItems ?? []),
      ...(data?.data.inTransitToSellerProductItems ?? []),
    ];

    const actualDataRfids = inTransitProductItems.map((p) => p.rfid);
    const actualProductItemRfids: string[] = [];
    const actualProductItems: ProductItemDTO[] = [];

    const filteredProductItems = productItems.filter((p) =>
      actualDataRfids?.includes(p.rfid)
    );

    for (const p of filteredProductItems) {
      if (!!p.rfid && !actualProductItemRfids.includes(p.rfid)) {
        actualProductItems.push(p);
        actualProductItemRfids.push(p.rfid);
      } else if (!p.rfid) {
        actualProductItems.push(p);
      }
    }

    setProductItems(actualProductItems);
  });
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
  const {
    isOpen: inStorageFacilityIsOpen,
    onOpen: inStorageFacilityOnOpen,
    onClose: inStorageFacilityOnClose,
  } = useDisclose();
  const {
    isOpen: returningIsOpen,
    onOpen: returningOnOpen,
    onClose: returningOnClose,
  } = useDisclose();
  const queryClient = useQueryClient();

  const open = (onOpen: () => void) => {
    queryClient.invalidateQueries(COURIER_PRODUCT_ITEMS);
    onOpen();
  };

  const inTransitProductItems = [
    ...(data?.data.inTransitToStorageFacilityProductItems ?? []),
    ...(data?.data.inTransitToBuyerProductItems ?? []),
    ...(data?.data.inTransitToSellerProductItems ?? []),
  ];
  const inTransitToSellerProductItems =
    data?.data.inTransitToSellerProductItems;

  const [location, setLocation] = useState<Location.LocationObject | undefined>(
    undefined
  );
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [animateToggle, setAnimateToggle] = useState(false);
  const socket = useContext(SocketContext);
  const { user } = useAuthStore();
  const company = user?.company;
  const [productItems, setProductItems] = useState<ProductItemDTO[]>([]);
  const [redFlagIds, setRedFlagIds] = useState<string[]>([]);

  const mapViewRef = useRef<MapView>(null);

  useEffect(() => {
    if (socket) {
      if (!socket.connected) {
        socket.connect();
      }

      socket.on("test", async (_data: ProductItemLocationDTO) => {
        // setLatitude(data.latitude);
        // setLongitude(data.longitude);

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
      });

      socket.on("test", (dto: ProductItemLocationDTO) => {
        const dataRfIds = inTransitProductItems.map((p) => p.rfid);
        const productItemsRfids = productItems.map((p) => p.rfid);

        if (
          dataRfIds?.includes(dto.rfid) &&
          !productItemsRfids.includes(dto.rfid)
        ) {
          const productItem = inTransitProductItems.find(
            (p) => p.rfid === dto.rfid
          );
          if (productItem) {
            setProductItems((prevProductItems) => {
              return [...prevProductItems, productItem];
            });
          }
        }

        setRedFlagIds(
          productItems
            .filter((p) => !!p.rfid)
            .filter((p) => dto.missingTags.split(",").includes(p.rfid!))
            .map((p) => p.rfid!)
        );
      });
    }
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
        mapViewRef.current?.fitToSuppliedMarkers(
          ["house", "truck", "warehouse"],
          {
            animated: true,
            edgePadding: {
              top: edgePadding,
              right: edgePadding,
              bottom: edgePadding,
              left: edgePadding,
            },
          }
        );
      }, 1000);
    }
  }, [mapViewRef.current, animateToggle]);

  const getUniqueCustomers = () => {
    if (inTransitProductItems) {
      const customersMap = new Map<string, UserDTO>();

      for (const p of inTransitProductItems) {
        if (!!p.customer && !customersMap.has(p.customer.id)) {
          customersMap.set(p.customer.id, p.customer);
        }
      }

      return Array.from(customersMap, ([_id, customer]) => customer);
    }
  };

  const getUniqueBuyers = () => {
    if (inTransitProductItems) {
      const buyersMap = new Map<string, CompanyDTO>();

      for (const p of inTransitProductItems) {
        if (!!p.buyer && !buyersMap.has(p.buyer.id)) {
          buyersMap.set(p.buyer.id, p.buyer);
        }
      }

      return Array.from(buyersMap, ([_id, buyer]) => buyer);
    }
  };

  const getUniqueReturns = () => {
    if (inTransitToSellerProductItems) {
      const returnsMap = new Map<string, Directions>();

      for (const p of inTransitToSellerProductItems) {
        if (
          !!p.customer &&
          p.product?.company &&
          !returnsMap.has(p.product.company.id + p.customer.id)
        ) {
          returnsMap.set(p.product.company.id + p.customer.id, {
            origin: {
              latitude: p.customer.addressLatitude!,
              longitude: p.customer.addressLongitude!,
            },
            destination: {
              latitude: p.product.company.addressLatitude,
              longitude: p.product.company.addressLongitude,
            },
          });
        }
      }

      return Array.from(returnsMap, ([_id, direction]) => direction);
    }
  };

  const toggleAnimation = () => {
    setAnimateToggle((prev) => !prev);
  };

  const getFilteredProductItems = () => {
    const actualProductItemRfids: string[] = [];
    const actualProductItems: ProductItemDTO[] = [];

    for (const p of productItems) {
      if (!!p.rfid && !actualProductItemRfids.includes(p.rfid)) {
        actualProductItems.push(p);
        actualProductItemRfids.push(p.rfid);
      } else if (!p.rfid) {
        actualProductItems.push(p);
      }
    }

    return actualProductItems;
  };

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
        w="full"
        flexWrap="wrap"
      >
        <Button
          m="2"
          onPress={() => open(toBePickedUpOnOpen)}
          bg="blueGray.700"
        >
          To Be Picked Up
        </Button>
        <Button
          m="2"
          onPress={() => open(inStorageFacilityOnOpen)}
          bg="blueGray.700"
        >
          In Storage Facility
        </Button>
        <Button m="2" onPress={() => open(inTransitOnOpen)} bg="blueGray.700">
          Current Delivery
        </Button>
        <Button m="2" onPress={() => open(returningOnOpen)} bg="blueGray.700">
          Return Accepted
        </Button>
      </Flex>

      <Actionsheet isOpen={toBePickedUpIsOpen} onClose={toBePickedUpOnClose}>
        <Actionsheet.Content bg="blueGray.700">
          <Box w="full">
            <Heading color="white">To Be Picked Up</Heading>
            {data?.data.toBePickedUpProductItems.map((p) => (
              <CourierProductItemToBePickedUp
                key={p.id}
                productItem={p}
                onChangeStatus={toggleAnimation}
                userId={user?.id}
              />
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

      <Actionsheet
        isOpen={inStorageFacilityIsOpen}
        onClose={inStorageFacilityOnClose}
      >
        <Actionsheet.Content bg="blueGray.700">
          <Box w="full">
            <Heading color="white">In Storage Facility</Heading>
            {data?.data.inStorageFacilityProductItems.map((p) => (
              <CourierProductItemToBePickedUp
                key={p.id}
                productItem={p}
                onChangeStatus={toggleAnimation}
                userId={user?.id}
              />
            ))}

            {data?.data.inStorageFacilityProductItems.length === 0 && (
              <Text color="white" textAlign="center" mt="2">
                No{" "}
                <ProductItemStatusBadge
                  status={ProductItemDTOStatusEnum.InStorageFacility}
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
            {getFilteredProductItems().map((p) => (
              <CourierProductItemInTransit
                key={p.id}
                productItem={p}
                onChangeStatus={toggleAnimation}
                isRedFlag={redFlagIds.includes(p.rfid!)}
              />
            ))}

            {inTransitProductItems.length === 0 && (
              <Text color="white" textAlign="center" mt="2">
                No{" "}
                <ProductItemStatusBadge
                  status={ProductItemDTOStatusEnum.InTransitToStorageFacility}
                />{" "}
                or{" "}
                <ProductItemStatusBadge
                  status={ProductItemDTOStatusEnum.InTransitToBuyer}
                />{" "}
                or{" "}
                <ProductItemStatusBadge
                  status={ProductItemDTOStatusEnum.InTransitToSeller}
                />{" "}
                product items
              </Text>
            )}
          </Box>
        </Actionsheet.Content>
      </Actionsheet>

      <Actionsheet isOpen={returningIsOpen} onClose={returningOnClose}>
        <Actionsheet.Content bg="blueGray.700">
          <Box w="full">
            <Heading color="white">Return Accepted</Heading>
            {data?.data.returnAcceptedProductItems.map((p) => (
              <CourierProductItemInTransit
                key={p.id}
                productItem={p}
                onChangeStatus={toggleAnimation}
              />
            ))}

            {data?.data.returnAcceptedProductItems.length === 0 && (
              <Text color="white" textAlign="center" mt="2">
                No{" "}
                <ProductItemStatusBadge
                  status={ProductItemDTOStatusEnum.ReturnAccepted}
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
              {getUniqueBuyers()?.map((b) => (
                <React.Fragment key={b.id}>
                  <MapViewDirections
                    origin={{ latitude, longitude }}
                    destination={{
                      latitude: b.addressLatitude!,
                      longitude: b.addressLongitude!,
                    }}
                    apikey={GOOGLE_MAPS_API_KEY ?? ""}
                    strokeWidth={5}
                    strokeColor="blue"
                  />
                  <Marker
                    key={b.id}
                    coordinate={{
                      latitude: b.addressLatitude!,
                      longitude: b.addressLongitude!,
                    }}
                    identifier="warehouse"
                  >
                    <Image
                      source={require("./images/warehouse.png")}
                      style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
                    />
                  </Marker>
                </React.Fragment>
              ))}

              {getUniqueCustomers()?.map((c) => (
                <React.Fragment key={c.id}>
                  <MapViewDirections
                    origin={{ latitude, longitude }}
                    destination={{
                      latitude: c.addressLatitude!,
                      longitude: c.addressLongitude!,
                    }}
                    apikey={GOOGLE_MAPS_API_KEY ?? ""}
                    strokeWidth={5}
                    strokeColor="blue"
                  />
                  <Marker
                    key={c.id}
                    coordinate={{
                      latitude: c.addressLatitude!,
                      longitude: c.addressLongitude!,
                    }}
                    identifier="house"
                  >
                    <Image
                      source={require("./images/house.png")}
                      style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
                    />
                  </Marker>
                </React.Fragment>
              ))}

              {getUniqueReturns()?.map((r) => (
                <React.Fragment
                  key={r.origin.latitude + r.destination.longitude}
                >
                  <MapViewDirections
                    origin={{
                      latitude: r.origin.latitude,
                      longitude: r.origin.longitude,
                    }}
                    destination={{
                      latitude: r.destination.latitude,
                      longitude: r.destination.longitude,
                    }}
                    apikey={GOOGLE_MAPS_API_KEY ?? ""}
                    strokeWidth={5}
                    strokeColor="red"
                  />
                  <Marker
                    coordinate={{
                      latitude: r.destination.latitude,
                      longitude: r.destination.longitude,
                    }}
                    identifier="warehouse"
                  >
                    <Image
                      source={require("./images/warehouse.png")}
                      style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
                    />
                  </Marker>
                  <Marker
                    coordinate={{
                      latitude: r.origin.latitude,
                      longitude: r.origin.longitude,
                    }}
                    identifier="house"
                  >
                    <Image
                      source={require("./images/house.png")}
                      style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
                    />
                  </Marker>
                </React.Fragment>
              ))}

              <Marker
                coordinate={{
                  latitude,
                  longitude,
                }}
                identifier="truck"
              >
                <Image
                  source={require("./images/delivery-truck.png")}
                  style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
                />
              </Marker>

              {company && (
                <>
                  <MapViewDirections
                    origin={{
                      latitude,
                      longitude,
                    }}
                    destination={{
                      latitude: company.addressLatitude,
                      longitude: company.addressLongitude,
                    }}
                    apikey={GOOGLE_MAPS_API_KEY ?? ""}
                    strokeWidth={5}
                    strokeColor="green"
                  />
                  <Marker
                    coordinate={{
                      latitude: company.addressLatitude,
                      longitude: company.addressLongitude,
                    }}
                    identifier="warehouse"
                  ></Marker>
                </>
              )}
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
