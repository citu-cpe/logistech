import { Flex, Text } from '@chakra-ui/react';

export const Header = () => {
  return (
    <Flex justify='flex-end' mb='10'>
      <Flex
        backgroundColor='gray.700'
        border='1px solid black'
        borderRadius='full'
        h='20'
        w='20'
        justify='center'
        align='center'
      >
        <Text textAlign='center'>System Logo</Text>
      </Flex>
    </Flex>
  );
};
