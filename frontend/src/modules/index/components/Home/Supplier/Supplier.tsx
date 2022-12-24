import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { SupplierHomeChart } from './SupplierHomeChart';

export const Supplier = () => {
  return (
    <Box>
      <SupplierHomeChart />

      <Box borderRadius='md' p='10' backgroundColor='gray.700'>
        <Flex
          justify='space-between'
          flexWrap='wrap'
          rowGap='6'
          borderColor='gray.900'
          p='10'
          mb='6'
        >
          {Array.from(Array(8)).map((_, i) => (
            <Flex
              key={i}
              direction='column'
              align='center'
              flexGrow='1'
              flexBasis='21%'
            >
              <Flex
                justify='center'
                align='center'
                w='20'
                h='20'
                textAlign='center'
                backgroundColor='gray.800'
                borderRadius='md'
                mb='2'
              >
                <Text fontSize='4xl'>X</Text>
              </Flex>
              <Text fontSize='lg'>Product</Text>
            </Flex>
          ))}
        </Flex>

        <Flex justify='space-around'>
          <Button colorScheme='gray'>On hold</Button>
          <Button colorScheme='gray'>In Transit</Button>
          <Button colorScheme='gray'>Bulked</Button>
          <Button colorScheme='gray'>Customers</Button>
        </Flex>
      </Box>
    </Box>
  );
};
