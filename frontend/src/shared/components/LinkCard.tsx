import { chakra, ChakraProps, Flex, Text } from '@chakra-ui/react';
import { UrlObject } from 'url';
import Link from 'next/link';

const NextLink = chakra(Link);

interface LinkCardProps {
  title: string;
  n: string | number;
  href: string | UrlObject;
}

export const LinkCard = ({
  title,
  n,
  href,
  ...props
}: LinkCardProps & ChakraProps) => {
  return (
    <NextLink href={href} {...props}>
      <Flex
        backgroundColor='gray.700'
        direction='column'
        align='center'
        justify='center'
        borderRadius='md'
        px='10'
        py='4'
        h='full'
      >
        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          fontWeight='bold'
          textAlign='center'
        >
          {title}
        </Text>
        <Text fontSize='xl'>{n}</Text>
      </Flex>
    </NextLink>
  );
};
