import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ProductItemByStatusDTOStatusEnum,
  ProductItemLocationDTO,
} from "generated-api";
import {
  ArrowBackIcon,
  ArrowDownIcon,
  ArrowForwardIcon,
  ArrowUpIcon,
  Box,
  Button,
  Flex,
  Spacer,
} from "native-base";
import MapView, { Marker } from "react-native-maps";
import { HomeStackParamList } from "./HomeStackScreen";
import { StyleSheet, Image } from "react-native";
import * as Location from "expo-location";
import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "../shared/providers/SocketProvider";

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
  const increment = 0.001;

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
      let { status } = await Location.requestForegroundPermissionsAsync();
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

  const right = () => {
    setLongitude((prevLong) => {
      if (prevLong) {
        return prevLong + increment;
      }
    });
  };

  const left = () => {
    setLongitude((prevLong) => {
      if (prevLong) {
        return prevLong - increment;
      }
    });
  };

  const down = () => {
    setLatitude((prevLat) => {
      if (prevLat) {
        return prevLat - increment;
      }
    });
  };

  const up = () => {
    setLatitude((prevLat) => {
      if (prevLat) {
        return prevLat + increment;
      }
    });
  };

  return (
    <>
      <Box
        flex={1}
        p={5}
        position="absolute"
        bottom="0"
        alignSelf="flex-end"
        zIndex={1000000}
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

        <Flex alignItems="center" w="full" mt="2">
          <Button onPress={up} mb="2">
            <ArrowUpIcon color="white" />
          </Button>
          <Flex justifyContent="space-between" flexDir="row">
            <Button onPress={left} mr="8">
              <ArrowBackIcon color="white" />
            </Button>
            <Button onPress={right} ml="8">
              <ArrowForwardIcon color="white" />
            </Button>
          </Flex>
          <Button onPress={down} mt="2">
            <ArrowDownIcon color="white" />
          </Button>
        </Flex>
      </Box>
      {location && (
        <MapView
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={styles.map}
        >
          {longitude && latitude && (
            <Marker
              title="You"
              coordinate={{
                longitude: longitude,
                latitude: latitude,
              }}
            >
              <Image
                source={{
                  uri: "https://scontent.fmnl4-1.fna.fbcdn.net/v/t39.30808-6/245084764_4764237220303156_3995653855045047749_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeHlVRuOTeyrqI7R9mEOKmGiWFedVI3L6LtYV51Ujcvou4huCmkDDMm61ZAjbRvvFBrQvK6dhCKcQI8wSWbB8nay&_nc_ohc=w0IyNwyUWk8AX976pRf&_nc_ht=scontent.fmnl4-1.fna&oh=00_AfDJy-U8zDmBJradT9ZbIKNZNU8liU5aRST368eLM1WMHw&oe=644D43D6",
                }}
                style={{ height: 35, width: 35 }}
              />
            </Marker>
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
