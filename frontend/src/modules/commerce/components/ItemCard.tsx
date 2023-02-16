import {
  Card,
  CardBody,
  Stack,
  Heading,
  Divider,
  CardFooter,
  Button,
  Text,
} from '@chakra-ui/react';
import { ProductDTO } from 'generated-api';
import { Peso } from '../../../shared/components/Peso';
import { useAddToCart } from '../../cart/hooks/useAddToCart';

interface ItemCardProps {
  product: ProductDTO;
  companyId: string;
}

export const ItemCard: React.FC<ItemCardProps> = ({ product, companyId }) => {
  const addItemToCart = useAddToCart(companyId!);

  const addToCart = (dto: ProductDTO) => {
    addItemToCart.mutate({ productId: dto.id, quantity: 1 });
  };

  return (
    <Card w='30%' key={product.id}>
      <CardBody>
        <Stack spacing='3'>
          <Heading size='md'>{product.name}</Heading>
          <Heading size='sm'>{product.company?.name}</Heading>
          {product.bulk && <Text>Items per box: {product.bulkQuantity}</Text>}
          <Text fontWeight='bold' fontSize='xl' textAlign='right'>
            <Peso amount={product.price} />{' '}
            {product.bulk && <Text display='inline'>per box</Text>}
          </Text>
          {product.numInStock === 0 && (
            <Text textAlign='right' fontWeight='semibold' color='red.600'>
              Out of stock
            </Text>
          )}
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <Button
          w='full'
          colorScheme='blue'
          disabled={product.numInStock === 0}
          isLoading={addItemToCart.isLoading}
          onClick={() => addToCart(product)}
        >
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  );
};
