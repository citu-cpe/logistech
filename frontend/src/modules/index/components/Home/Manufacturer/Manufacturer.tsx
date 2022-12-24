import {
  Box,
  Button,
  Flex,
  Heading,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { LinkCard } from '../../../../../shared/components/LinkCard';
import { ManufacturerHomeChart } from './ManufacturerHomeChart';

export const Manufacturer = () => {
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

      <Flex justify='space-between' mb='8' gap='14'>
        <LinkCard title='On Hold' n='nn' href='/on-hold' />
        <LinkCard title='New Arrival' n='n' href='/new-arrival' />
        <LinkCard title='In Transit' n='n' href='/in-transit' />
        <LinkCard title='Couriers' n='n' href='/couriers' />
      </Flex>

      <Flex gap='4' h='sm' align='center'>
        <ManufacturerHomeChart flexBasis='65%' />

        <Box
          borderRadius='md'
          backgroundColor='gray.700'
          flexGrow='1'
          p='6'
          h='full'
          overflowY='auto'
        >
          <Heading size='md' textAlign='center' mb='4'>
            Return Handling
          </Heading>
          <Text align='right' fontWeight='bold'>
            Status
          </Text>

          <UnorderedList>
            {Array.from(Array(20)).map((_, i) => (
              <ListItem key={i}>
                <Flex justify='space-between'>
                  <Text>RFIDxxx</Text> <Text>------------</Text>
                </Flex>
              </ListItem>
            ))}
          </UnorderedList>
        </Box>
      </Flex>
    </Box>
  );
};
