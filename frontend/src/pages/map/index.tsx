import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Box, Center, Flex, Heading } from '@chakra-ui/react';
import {
  DirectionsRenderer,
  GoogleMap,
  MarkerF,
  useJsApiLoader,
} from '@react-google-maps/api';
import {
  CompanyDTO,
  ProductItemByStatusDTOStatusEnum,
  ProductItemLocationDTO,
  UserDTO,
} from 'generated-api';
import { SocketContext } from '../../shared/providers/SocketProvider';
import { useGlobalStore } from '../../shared/stores';
import { useGetProductItemsByStatus } from '../../modules/products/hooks/useGetProductItemsByStatus';

const MAP_ICON_SIZE = 50;

interface Directions {
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
}

const GoogleMapPage = () => {
  const socket = useContext(SocketContext);
  const getUser = useGlobalStore().getUser;
  const user = getUser();
  const company = user?.company;
  const { data } = useGetProductItemsByStatus(
    company?.id,
    ProductItemByStatusDTOStatusEnum.InTransit
  );
  const { data: returningData } = useGetProductItemsByStatus(
    company?.id,
    ProductItemByStatusDTOStatusEnum.Returning
  );
  const inTransitProductItems = data?.data;
  const returningProductItems = returningData?.data;

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
  });

  const [courierLatLng, setCourierLatLng] = useState<
    google.maps.LatLngLiteral | undefined
  >(undefined);
  const [companyAddressLatLng, setCompanyAddressLatLng] = useState<
    google.maps.LatLngLiteral | undefined
  >(undefined);
  const [userAddressLatLng, setUserAddressLatLng] = useState<
    google.maps.LatLngLiteral | undefined
  >(undefined);
  const [directions, setDirections] = useState<google.maps.DirectionsResult[]>(
    []
  );

  const successCallback = useCallback((position: any) => {
    setCourierLatLng({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  }, []);

  const errorCallback = useCallback(
    (error: any) => {
      switch (error.code) {
        case error.TIMEOUT:
          // Acquire a new position object.
          navigator.geolocation.getCurrentPosition(
            successCallback,
            errorCallback
          );
          break;
      }
    },
    [successCallback]
  );

  const getUniqueCustomers = useCallback(() => {
    if (inTransitProductItems) {
      const customersMap = new Map<string, UserDTO>();

      for (const p of inTransitProductItems) {
        if (!!p.customer && !customersMap.has(p.customer.id)) {
          customersMap.set(p.customer.id, p.customer);
        }
      }

      return Array.from(customersMap, ([_id, customer]) => customer);
    }
  }, [inTransitProductItems]);

  const getUniqueBuyers = useCallback(() => {
    if (inTransitProductItems) {
      const buyersMap = new Map<string, CompanyDTO>();

      for (const p of inTransitProductItems) {
        if (!!p.buyer && !buyersMap.has(p.buyer.id)) {
          buyersMap.set(p.buyer.id, p.buyer);
        }
      }

      return Array.from(buyersMap, ([_id, buyer]) => buyer);
    }
  }, [inTransitProductItems]);

  const getUniqueReturns = useCallback(() => {
    if (returningProductItems) {
      const returnsMap = new Map<string, Directions>();

      for (const p of returningProductItems) {
        if (
          !!p.customer &&
          p.product?.company &&
          !returnsMap.has(p.product.company.id + p.customer.id)
        ) {
          returnsMap.set(p.product.company.id + p.customer.id, {
            origin: {
              lat: p.customer.addressLatitude!,
              lng: p.customer.addressLongitude!,
            },
            destination: {
              lat: p.product.company.addressLatitude,
              lng: p.product.company.addressLongitude,
            },
          });
        }
      }

      return Array.from(returnsMap, ([_id, direction]) => direction);
    }
  }, [returningProductItems]);

  useEffect(() => {
    if (socket) {
      if (!socket.connected) {
        socket.connect();
      }

      socket.on('test', (_location: ProductItemLocationDTO) => {
        // setCourierLatLng({ lat: location.latitude, lng: location.longitude });

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            successCallback,
            errorCallback,
            { maximumAge: 0, timeout: 0 }
          );
        }
      });

      socket.on('scan', () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            successCallback,
            errorCallback,
            { maximumAge: 0, timeout: 0 }
          );
        }
      });
    }

    return () => {
      socket?.close();
    };
  }, [socket, errorCallback, successCallback]);

  useEffect(() => {
    if (company && !companyAddressLatLng) {
      setCompanyAddressLatLng({
        lat: company.addressLatitude,
        lng: company.addressLongitude,
      });
    }
  }, [company, companyAddressLatLng]);

  useEffect(() => {
    const uniqueCustomers = getUniqueCustomers();
    const uniqueBuyers = getUniqueBuyers();
    const uniqueReturns = getUniqueReturns();
    const newDirections: google.maps.DirectionsResult[] = [];

    if (courierLatLng && uniqueCustomers && uniqueBuyers && uniqueReturns) {
      const directionsService = new google.maps.DirectionsService();

      for (const c of uniqueCustomers) {
        directionsService.route(
          {
            origin: courierLatLng,
            destination: { lat: c.addressLatitude!, lng: c.addressLongitude! },
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK && result) {
              newDirections.push(result);
            }
          }
        );
      }

      for (const b of uniqueBuyers) {
        directionsService.route(
          {
            origin: courierLatLng,
            destination: { lat: b.addressLatitude, lng: b.addressLongitude },
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK && result) {
              newDirections.push(result);
            }
          }
        );
      }

      for (const r of uniqueReturns) {
        directionsService.route(
          {
            origin: r.origin,
            destination: r.destination,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK && result) {
              newDirections.push(result);
            }
          }
        );
      }

      setTimeout(() => {
        if (newDirections.length > 0) {
          setDirections(newDirections);
        }
      }, 2000);
    }
  }, [courierLatLng, getUniqueBuyers, getUniqueCustomers, getUniqueReturns]);

  useEffect(() => {
    if (user && !userAddressLatLng) {
      setUserAddressLatLng({
        lat: user.addressLatitude!,
        lng: user.addressLongitude!,
      });
    }
  }, [user, userAddressLatLng]);

  return (
    <Flex h='full' flexDir='column'>
      <Heading mb='6'>Map</Heading>

      <Box flex={1}>
        {isLoaded && (companyAddressLatLng || userAddressLatLng) && (
          <GoogleMap
            mapContainerStyle={{ height: '100%', width: '100%' }}
            center={courierLatLng ?? companyAddressLatLng ?? userAddressLatLng}
            zoom={11}
          >
            {companyAddressLatLng ? (
              <MarkerF position={companyAddressLatLng}></MarkerF>
            ) : userAddressLatLng ? (
              <MarkerF position={userAddressLatLng}></MarkerF>
            ) : undefined}

            {courierLatLng && (
              <MarkerF
                position={courierLatLng}
                icon={{
                  url: '/images/delivery-truck.png',
                  scaledSize: new google.maps.Size(
                    MAP_ICON_SIZE,
                    MAP_ICON_SIZE
                  ),
                }}
              ></MarkerF>
            )}

            {getUniqueBuyers()?.map((b) => (
              <React.Fragment key={b.id}>
                <MarkerF
                  key={b.id}
                  position={{
                    lat: b.addressLatitude,
                    lng: b.addressLongitude,
                  }}
                  icon={{
                    url: '/images/warehouse.png',
                    scaledSize: new google.maps.Size(
                      MAP_ICON_SIZE,
                      MAP_ICON_SIZE
                    ),
                  }}
                />
              </React.Fragment>
            ))}

            {getUniqueCustomers()?.map((c) => (
              <React.Fragment key={c.id}>
                <MarkerF
                  position={{
                    lat: c.addressLatitude!,
                    lng: c.addressLongitude!,
                  }}
                  icon={{
                    url: '/images/house.png',
                    scaledSize: new google.maps.Size(
                      MAP_ICON_SIZE,
                      MAP_ICON_SIZE
                    ),
                  }}
                />
              </React.Fragment>
            ))}

            {getUniqueReturns()?.map((r) => (
              <React.Fragment key={r.origin.lat + r.destination.lng}>
                <MarkerF
                  position={{
                    lat: r.destination.lat,
                    lng: r.destination.lng,
                  }}
                  icon={{
                    url: '/images/warehouse.png',
                    scaledSize: new google.maps.Size(
                      MAP_ICON_SIZE,
                      MAP_ICON_SIZE
                    ),
                  }}
                />
                <MarkerF
                  position={{
                    lat: r.origin.lat,
                    lng: r.origin.lng,
                  }}
                  icon={{
                    url: '/images/house.png',
                    scaledSize: new google.maps.Size(
                      MAP_ICON_SIZE,
                      MAP_ICON_SIZE
                    ),
                  }}
                />
              </React.Fragment>
            ))}

            {directions.map((d, i) => (
              <DirectionsRenderer key={i} directions={d} />
            ))}
          </GoogleMap>
        )}

        {!isLoaded && (
          <Center h='full' w='full'>
            Google Maps loading...
          </Center>
        )}
      </Box>
    </Flex>
  );
};

export default GoogleMapPage;
