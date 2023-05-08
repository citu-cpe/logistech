import { Center, Heading, useToast, Text, Box, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Payment = () => {
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (router.query.success) {
      toast({
        status: 'success',
        title: 'Successfully paid order',
        isClosable: true,
        variant: 'subtle',
      });
    } else if (router.query.canceled) {
      toast({
        status: 'success',
        title: 'Successfully canceled payment',
        isClosable: true,
        variant: 'subtle',
      });
    }
  }, [router.query, toast]);

  return (
    <Center h='full' w='full'>
      <Flex flexDir='column'>
        <Box>
          {router.query.success && <Heading>Successfully paid order</Heading>}
          {!router.query.success && (
            <Heading>Successfully canceled order</Heading>
          )}
        </Box>

        <Center>
          <Text>You may now return to the app</Text>
        </Center>
      </Flex>
    </Center>
  );
};

export default Payment;
