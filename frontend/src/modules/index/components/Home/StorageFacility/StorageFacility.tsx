import { Flex, Box } from '@chakra-ui/react';
import { LinkCard } from '../../../../../shared/components/LinkCard';
import { StorageFacilityHomeChart } from './StorageFacilityHomeChart';

export const StorageFacility = () => {
  const flexBasis = { base: '40%', md: '30%' };

  return (
    <Box>
      <Flex flexWrap='wrap' justify='center' rowGap='8' columnGap='8' mb='10'>
        <LinkCard
          flexBasis={flexBasis}
          title='On Hold'
          n='nn'
          href='/on-hold'
        />
        <LinkCard
          flexBasis={flexBasis}
          title='New Arrival'
          n='n'
          href='/new-arrival'
        />
        <LinkCard
          flexBasis={flexBasis}
          title='To Be Picked'
          n='nn'
          href='/to-be-picked'
        />
        <LinkCard
          flexBasis={flexBasis}
          title='Clustered'
          n='nn'
          href='/clustered'
        />
        <LinkCard
          flexBasis={flexBasis}
          title='In Transit'
          n='n'
          href='/in-transit'
        />
        <LinkCard
          flexBasis={flexBasis}
          title='Ready To Dispatch'
          n='n'
          href='/ready-to-dispatch'
        />
        <LinkCard
          flexBasis={flexBasis}
          title='Cancelled'
          n='n'
          href='/cancelled'
        />
      </Flex>

      <StorageFacilityHomeChart />
    </Box>
  );
};
