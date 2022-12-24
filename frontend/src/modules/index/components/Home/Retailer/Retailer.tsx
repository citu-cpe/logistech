import {
  Box,
  Flex,
  Heading,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { LinkCard } from '../../../../../shared/components/LinkCard';
import { RetailerHomeChart } from './RetailerHomeChart';

export const Retailer = () => {
  return (
    <Box>
      <RetailerHomeChart mb='8' />

      <Box borderRadius='md' backgroundColor='gray.700' p='6'>
        <Flex justify='space-between' mb='8'>
          <LinkCard
            backgroundColor='gray.800'
            title='On Hold'
            n='nn'
            href='/on-hold'
            flexGrow='1'
            flexBasis='21%'
          />
          <LinkCard
            backgroundColor='gray.800'
            title='New Arrival'
            n='n'
            href='/new-arrival'
            flexGrow='1'
            flexBasis='21%'
          />
          <LinkCard
            backgroundColor='gray.800'
            title='In Transit'
            n='n'
            href='/in-transit'
            flexGrow='1'
            flexBasis='21%'
          />
          <LinkCard
            backgroundColor='gray.800'
            title='Couriers'
            n='n'
            href='/couriers'
            flexGrow='1'
            flexBasis='21%'
          />
        </Flex>

        <Flex h='2xs'>
          <Box
            backgroundColor='gray.700'
            flexGrow='1'
            p='6'
            h='full'
            overflowY='auto'
          >
            <Heading size='md' textAlign='center' mb='4'>
              Currently Ordered
            </Heading>
            <Text align='right' fontWeight='bold'>
              Status
            </Text>

            <UnorderedList>
              {Array.from(Array(10)).map((_, i) => (
                <ListItem key={i}>
                  <Flex justify='space-between'>
                    <Text>RFIDxxx</Text> <Text>------------</Text>
                  </Flex>
                </ListItem>
              ))}
            </UnorderedList>
          </Box>

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
              {Array.from(Array(10)).map((_, i) => (
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
    </Box>
  );
};
