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
    case ProductItemDTOStatusEnum.InTransitToStorageFacility:
      colorScheme = 'teal';
      break;
    case ProductItemDTOStatusEnum.InStorageFacility:
      colorScheme = 'purple';
      break;
    case ProductItemDTOStatusEnum.InTransitToBuyer:
      colorScheme = 'cyan';
      break;
    case ProductItemDTOStatusEnum.RedFlag:
      colorScheme = 'red';
      break;
    case ProductItemDTOStatusEnum.Canceled:
      colorScheme = 'gray';
      break;
    case ProductItemDTOStatusEnum.ReturnRequested:
      colorScheme = 'gray';
      break;
    case ProductItemDTOStatusEnum.ReturnAccepted:
      colorScheme = 'green';
      break;
    case ProductItemDTOStatusEnum.ReturnRejected:
      colorScheme = 'red';
      break;
    case ProductItemDTOStatusEnum.InTransitToSeller:
      colorScheme = 'gray';
      break;
    case ProductItemDTOStatusEnum.Returned:
      colorScheme = 'gray';
      break;
    case ProductItemDTOStatusEnum.Complete:
      colorScheme = 'green';
      break;
  }

  return <Badge colorScheme={colorScheme}>{status.replaceAll('_', ' ')}</Badge>;
};
