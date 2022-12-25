import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { SupplierHomeChart } from './SupplierHomeChart';

export const Supplier = () => {
  return (
    <Box>
      <SupplierHomeChart />

      <Box borderRadius='md' py='6' backgroundColor='gray.700'>
        <Flex
          flexWrap='wrap'
          justify={{ base: 'center', md: 'space-between' }}
          rowGap='6'
          borderColor='gray.900'
          mb='10'
        >
          {Array.from(Array(8)).map((_, i) => (
            <Flex
              key={i}
              direction='column'
              align='center'
              flexBasis={{ base: '30%', md: '21%' }}
            >
              <Flex
                justify='center'
                align='center'
                w={{ base: '16', md: '20' }}
                h={{ base: '16', md: '20' }}
                textAlign='center'
                backgroundColor='gray.800'
                borderRadius='md'
                mb='2'
              >
                <Text fontSize={{ base: '2xl', md: '4xl' }}>X</Text>
              </Flex>
              <Text fontSize={{ base: 'sm', md: 'lg' }}>Product</Text>
            </Flex>
          ))}
        </Flex>

        <Flex justify='space-around' flexWrap='wrap' rowGap='6'>
          <Button colorScheme='gray' flexBasis={{ base: '40%', md: 'auto' }}>
            On hold
          </Button>
          <Button colorScheme='gray' flexBasis={{ base: '40%', md: 'auto' }}>
            In Transit
          </Button>
          <Button colorScheme='gray' flexBasis={{ base: '40%', md: 'auto' }}>
            Bulked
          </Button>
          <Button colorScheme='gray' flexBasis={{ base: '40%', md: 'auto' }}>
            Customers
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};
