import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import { LinkCard } from '../../../../../shared/components/LinkCard';
import { StatusList } from '../../../../../shared/components/StatusList';
import { ManufacturerHomeChart } from './ManufacturerHomeChart';

export const Manufacturer = () => {
  const flexBasis = { base: '40%', md: '25%' };

  return (
    <Box>
      <Flex gap='4' mb='8'>
        <Button colorScheme='gray' textTransform='uppercase'>
          Book
        </Button>
        <Button colorScheme='gray' textTransform='uppercase'>
          Invoice
        </Button>
        <Button colorScheme='gray' textTransform='uppercase'>
          Customer
        </Button>
      </Flex>

      <Flex justify='center' mb='8' gap='14' flexWrap='wrap'>
        <LinkCard
          title='On Hold'
          n='nn'
          href='/on-hold'
          flexBasis={flexBasis}
        />
        <LinkCard
          title='New Arrival'
          n='n'
          href='/new-arrival'
          flexBasis={flexBasis}
        />
        <LinkCard
          title='In Transit'
          n='n'
          href='/in-transit'
          flexBasis={flexBasis}
        />
        <LinkCard
          title='Couriers'
          n='n'
          href='/couriers'
          flexBasis={flexBasis}
        />
      </Flex>

      <Flex gap='4' h='sm' align='center' flexWrap='wrap'>
        <ManufacturerHomeChart flexBasis={{ base: '100%', md: '65%' }} />

        <Box rounded='md' backgroundColor='gray.700' p='6' flexGrow='1'>
          <Heading size='md' textAlign='center' mb='4'>
            Return Handling
          </Heading>

          <StatusList />
        </Box>
      </Flex>
    </Box>
  );
};
