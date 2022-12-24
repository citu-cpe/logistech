import { Box, ChakraProps, Text } from '@chakra-ui/react';
import { UrlObject } from 'url';
import NextLink from 'next/link';

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
    <NextLink href={href}>
      <Box
        backgroundColor='gray.700'
        display='flex'
        flexDirection='column'
        alignItems='center'
        borderRadius='md'
        px='10'
        py='4'
        {...props}
      >
        <Text fontSize='2xl' fontWeight='bold'>
          {title}
        </Text>
        <Text fontSize='xl'>{n}</Text>
      </Box>
    </NextLink>
  );
};
