import { CreateOrderFromOrderItemsDTO, ProductDTO } from "generated-api";
import { Box, Button, Divider, Flex, Text } from "native-base";
import { useAddToCartCustomer } from "../hooks/useAddToCartCustomer";
import { CompanyTypeBadge } from "./CompanyTypeBadge";
import { Peso } from "./Peso";
import { OrderItemQuantityInput } from "./OrderItemQuantityInput";
import { useCreateOrdersFromOrderItemsForCustomer } from "../hooks/useCreateOrdersFromOrderItemsForCustomer";

interface CommerceItemProps {
  product: ProductDTO;
}

export const CommerceItem: React.FC<CommerceItemProps> = ({ product }) => {
  const addItemToCart = useAddToCartCustomer();
  const createOrdersFromOrderItems = useCreateOrdersFromOrderItemsForCustomer();

  const addToCart = (dto: ProductDTO) => {
    addItemToCart.mutate({ productId: dto.id, quantity: 1 });
  };

  const orderNow = (dto: CreateOrderFromOrderItemsDTO) => {
    createOrdersFromOrderItems.mutate(dto);
  };

  const outOfStock =
    product.numInStock === 0 || product.numInStock === product.numInCart;

  const showOrderNowButton =
    product.numInCart > 0 &&
    !!product.orderItems &&
    product.orderItems.length > 0;

  return (
    <>
      <Flex
        key={product.id}
        w="full"
        color="white"
        flexDir="row"
        justifyContent="space-between"
        alignItems="center"
        p="3"
      >
        <Box>
          <Text color="white" fontWeight="bold">
            {product.name}
          </Text>

          <Text color="white">{product.company?.name}</Text>

          {product.bulk && <Text color="white">{product.bulkQuantity}</Text>}

          <CompanyTypeBadge companyType={product.company?.type!} />

          {outOfStock && <Text color="error.700">Out of stock</Text>}

          {!outOfStock && product.numInStock < 5 && product.numInStock > 0 && (
            <Text color="error.700">
              Only {product.numInStock} item{product.numInStock > 1 && "s"} left
              in stock!
            </Text>
          )}
        </Box>

        <Box display="flex" alignItems="flex-end">
          <Text mb="2" color="white" fontWeight="bold" fontSize="xl">
            <Peso amount={product.price} color="white" fontWeight="bold" />{" "}
            {product.bulk && "per box"}
          </Text>
          <Button
            onPress={() => addToCart(product)}
            isLoading={addItemToCart.isLoading}
            isDisabled={product.numInStock === 0 || product.numInCart > 0}
          >
            {(product.numInStock === 0 || product.numInCart === 0) && (
              <Text color="white">Add to cart</Text>
            )}

            {product.numInCart > 0 && (
              <Text color="white">
                Added to cart (
                <Peso amount={product.price * product.numInCart} />)
              </Text>
            )}
          </Button>
        </Box>
      </Flex>

      <Flex flexDir="row" w="full" px="3" justifyContent="space-between" mb="2">
        {product.orderItems && product.orderItems[0] && (
          <Box>
            <OrderItemQuantityInput
              orderItem={product.orderItems[0]}
              max={product.numInStock}
            />
          </Box>
        )}

        {showOrderNowButton && (
          <Box>
            <Button
              isLoading={createOrdersFromOrderItems.isLoading}
              onPress={() =>
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

      <Divider />
    </>
  );
};
