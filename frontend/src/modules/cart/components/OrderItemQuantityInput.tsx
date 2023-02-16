import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import { OrderItemDTO } from 'generated-api';
import { useEffect, useState } from 'react';
import { useEditOrderItem } from '../hooks/useEditOrderItem';

interface OrderItemQuantityInputProps {
  orderItem: OrderItemDTO;
}

export const OrderItemQuantityInput: React.FC<OrderItemQuantityInputProps> = ({
  orderItem,
}) => {
  const editOrderItem = useEditOrderItem(orderItem.id);

  const [quantity, setQuantity] = useState(orderItem.quantity);

  useEffect(() => {
    setQuantity(orderItem.quantity);
  }, [orderItem.quantity]);

  return (
    <NumberInput
      defaultValue={orderItem.quantity}
      value={quantity}
      min={1}
      w='5em'
      clampValueOnBlur={false}
      isDisabled={editOrderItem.isLoading}
      onChange={(val) => {
        if (val.length > 0) {
          const parsedVal = Number.parseInt(val);
          editOrderItem.mutate(
            {
              ...orderItem,
              quantity: parsedVal,
              productId: orderItem.product.id,
            },
            {
              onSuccess: () => {
                setQuantity(parsedVal);
              },
              onError: () => {
                setQuantity((prev) => prev);
              },
            }
          );
        }
      }}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
};
