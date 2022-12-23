import { Flex, Box } from '@chakra-ui/react';
import { LinkCard } from '../../../../../shared/components/LinkCard';
import { StorageFacilityHomeChart } from './StorageFacilityHomeChart';

export const StorageFacility = () => {
  return (
    <Box>
      <Flex
        flexWrap='wrap'
        justifyContent='center'
        rowGap='8'
        columnGap='8'
        mb='10'
      >
        <LinkCard title='On Hold' n='nn' href='/on-hold' />
        <LinkCard title='New Arrival' n='n' href='/new-arrival' />
        <LinkCard title='To Be Picked' n='nn' href='/to-be-picked' />
        <LinkCard title='Clustered' n='nn' href='/clustered' />
        <LinkCard title='In Transit' n='n' href='/in-transit' />
        <LinkCard title='Ready To Dispatch' n='n' href='/ready-to-dispatch' />
        <LinkCard title='Cancelled' n='n' href='/cancelled' />
      </Flex>

      <StorageFacilityHomeChart />
    </Box>
  );
};
