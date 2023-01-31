import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Stack,
  Image,
  Text,
  Flex,
} from '@chakra-ui/react';
import { CompanyDTOTypeEnum } from 'generated-api';
import { useGetCommerceProducts } from '../../modules/commerce/hooks/useGetCommerceProducts';

const Commerce = () => {
  const { data } = useGetCommerceProducts(CompanyDTOTypeEnum.Supplier);

  return (
    <Box>
      <Flex flexWrap='wrap' gap='6'>
        {data?.data.map((product) => (
          <Card w='30%' key={product.id}>
            <CardBody>
              <Image
                src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                alt='Green double couch with wooden legs'
                borderRadius='md'
              />
              <Stack mt='6' spacing='3'>
                <Heading size='md'>{product.name}</Heading>
                <Heading size='sm'>{product.company?.name}</Heading>
                {product.bulk && (
                  <Text>Products per box: {product.bulkQuantity}</Text>
                )}
                <Text color='blue.600' fontSize='2xl'>
                  &#8369; {product.price}{' '}
                  {product.bulk && <Text display='inline'>per box</Text>}
                </Text>
              </Stack>
            </CardBody>
            <Divider />
            <CardFooter>
              <ButtonGroup spacing='2'>
                <Button variant='solid' colorScheme='blue'>
                  Buy now
                </Button>
                <Button variant='ghost' colorScheme='blue'>
                  Add to cart
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
        ))}
      </Flex>
    </Box>
  );
};

export default Commerce;
