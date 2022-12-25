import { Flex, Text, UnorderedList, ListItem } from '@chakra-ui/react';

export const StatusList = () => {
  return (
    <>
      <Text align='right' fontWeight='bold'>
        Status
      </Text>

      <UnorderedList maxH='xs' overflowY='auto'>
        {Array.from(Array(20)).map((_, i) => (
          <ListItem key={i}>
            <Flex justify='space-between'>
              <Text>RFIDxxx</Text>
              <Text>------------</Text>
            </Flex>
          </ListItem>
        ))}
      </UnorderedList>
    </>
  );
};
