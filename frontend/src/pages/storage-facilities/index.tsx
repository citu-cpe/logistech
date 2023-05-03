import {
  Box,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { StorageFacilitiesTable } from '../../modules/storage-facilities/components/StorageFacilitiesTable';
import { useGetAvailableStorageFacilities } from '../../modules/storage-facilities/hooks/useGetAvailableStorageFacilities';
import { useGetStorageFacilityPartners } from '../../modules/storage-facilities/hooks/useGetStorageFacilityPartnersQuery';
import { useGlobalStore } from '../../shared/stores';

const StorageFacilities = () => {
  const getUser = useGlobalStore().getUser;
  const companyId = getUser()?.company?.id;
  const storageFacilityPartnersQuery = useGetStorageFacilityPartners(
    companyId!
  );
  const availableStorageFacilitiesQuery = useGetAvailableStorageFacilities(
    companyId!
  );

  return (
    <Box>
      <Heading mb='6'>Storage Facilities</Heading>
      {storageFacilityPartnersQuery.isLoading ||
      availableStorageFacilitiesQuery.isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <Tabs isFitted>
          <TabList mb='1em'>
            <Tab>Partnered</Tab>
            <Tab>Available</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <StorageFacilitiesTable
                storageFacilities={
                  storageFacilityPartnersQuery?.data?.data ?? []
                }
              />
            </TabPanel>
            <TabPanel>
              <StorageFacilitiesTable
                storageFacilities={
                  availableStorageFacilitiesQuery?.data?.data ?? []
                }
                available
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
};

export default StorageFacilities;
