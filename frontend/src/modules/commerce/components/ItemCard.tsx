import {
  Box,
  Card,
  CardBody,
  Stack,
  Heading,
  Divider,
  CardFooter,
  Button,
  Text,
  Flex,
} from '@chakra-ui/react';
import { CreateOrderFromOrderItemsDTO, ProductDTO } from 'generated-api';
import { CompanyTypeBadge } from '../../../shared/components/CompanyTypeBadge';
import { Peso } from '../../../shared/components/Peso';
import { OrderItemQuantityInput } from '../../cart/components/OrderItemQuantityInput';
import { useAddToCart } from '../../cart/hooks/useAddToCart';
import { useCreateOrdersFromOrderItems } from '../hooks/useCreateOrderFromOrderItems';

interface ItemCardProps {
  product: ProductDTO;
  companyId: string;
}

export const ItemCard: React.FC<ItemCardProps> = ({ product, companyId }) => {
  const addItemToCart = useAddToCart(companyId);
  const createOrdersFromOrderItems = useCreateOrdersFromOrderItems(companyId);

  const addToCart = (dto: ProductDTO) => {
    addItemToCart.mutate({ productId: dto.id, quantity: 1 });
  };

  const orderNow = (dto: CreateOrderFromOrderItemsDTO) => {
    createOrdersFromOrderItems.mutate(dto);
  };

  const outOfStock =
    product.numInStock === 0 || product.numInStock === product.numInCart;

  return (
    <Card w='30%' key={product.id}>
      <CardBody>
        <Stack spacing='3'>
          <Heading size='md'>{product.name}</Heading>
          <Heading size='sm'>{product.company?.name}</Heading>
          <CompanyTypeBadge
            companyType={product.company?.type!}
            alignSelf='start'
          />
          {product.bulk && <Text>Items per box: {product.bulkQuantity}</Text>}
          <Text fontWeight='bold' fontSize='xl' textAlign='right'>
            <Peso amount={product.price} />{' '}
            {product.bulk && <Text display='inline'>per box</Text>}
          </Text>

          {!outOfStock && product.numInStock < 5 && product.numInStock > 0 && (
            <Text textAlign='right' fontWeight='semibold' color='red.600'>
              Only {product.numInStock} item{product.numInStock > 1 && 's'} left
              in stock!
            </Text>
          )}

          {outOfStock && (
            <Text textAlign='right' fontWeight='semibold' color='red.600'>
              Out of stock
            </Text>
          )}
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <Flex flexDir='column' w='full'>
          <Flex justifyContent='space-between' alignItems='center' w='full'>
            {product.orderItems && product.orderItems[0] && (
              <Box mr='4'>
                <OrderItemQuantityInput
                  orderItem={product.orderItems[0]}
                  max={product.numInStock}
                />
              </Box>
            )}

            <Button
              w='full'
              colorScheme='blue'
              disabled={product.numInStock === 0 || product.numInCart > 0}
              isLoading={addItemToCart.isLoading}
              onClick={() => addToCart(product)}
            >
              {(product.numInStock === 0 || product.numInCart === 0) && (
                <Text>Add to cart</Text>
              )}

              {product.numInCart > 0 && (
                <Text>
                  Added to cart (
                  <Peso amount={product.price * product.numInCart} />)
                </Text>
              )}
            </Button>
          </Flex>

          {product.numInCart > 0 &&
            !!product.orderItems &&
            product.orderItems.length > 0 && (
              <Box mt='4'>
                <Button
                  colorScheme='blue'
                  w='full'
                  isLoading={createOrdersFromOrderItems.isLoading}
                  onClick={() =>
                    orderNow({
                      orderItems: product.orderItems!,
                      owningCompanyId: product.company!.id,
                    })
                  }
                >
                  Order now
                </Button>
              </Box>
            )}
        </Flex>
      </CardFooter>
    </Card>
  );
};
