import { Badge } from '@chakra-ui/react';
import { ProductItemDTOStatusEnum } from 'generated-api';

interface ProductItemStatusBadgeProps {
  status: ProductItemDTOStatusEnum;
}

export const ProductItemStatusBadge: React.FC<ProductItemStatusBadgeProps> = ({
  status,
}) => {
  let colorScheme = '';

  switch (status) {
    case ProductItemDTOStatusEnum.InStorage:
      colorScheme = 'blue';
      break;
    case ProductItemDTOStatusEnum.OnHold:
      colorScheme = 'yellow';
      break;
    case ProductItemDTOStatusEnum.ToBePickedUp:
      colorScheme = 'orange';
      break;
    case ProductItemDTOStatusEnum.InTransit:
      colorScheme = 'teal';
      break;
    case ProductItemDTOStatusEnum.RedFlag:
      colorScheme = 'red';
      break;
    case ProductItemDTOStatusEnum.Canceled:
      colorScheme = 'gray';
      break;
    case ProductItemDTOStatusEnum.Complete:
      colorScheme = 'green';
      break;
  }

  return <Badge colorScheme={colorScheme}>{status.replaceAll('_', ' ')}</Badge>;
};
