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
  disabled?: boolean;
  max?: number;
}

export const OrderItemQuantityInput: React.FC<OrderItemQuantityInputProps> = ({
  orderItem,
  disabled,
  max,
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
      max={max}
      w='5em'
      clampValueOnBlur={false}
      isDisabled={editOrderItem.isLoading || disabled}
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
      <NumberInputField disabled={true} />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
};
