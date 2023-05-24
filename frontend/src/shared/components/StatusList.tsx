import { Flex, Text, UnorderedList, ListItem } from '@chakra-ui/react';
import {
  ProductItemByStatusDTOStatusEnum,
  ProductItemDTOStatusEnum,
} from 'generated-api';
import { useGetProductItemsByStatus } from '../../modules/products/hooks/useGetProductItemsByStatus';
import { useAuthStore } from '../stores';
import { ProductItemStatusBadge } from './ProductItemStatusBadge';

interface StatusListProps {
  status: ProductItemByStatusDTOStatusEnum;
}

export const StatusList: React.FC<StatusListProps> = ({ status }) => {
  const { companyId } = useAuthStore();
  const { data } = useGetProductItemsByStatus(companyId, status);

  return (
    <>
      <Text align='right' fontWeight='bold'>
        Status
      </Text>

      <UnorderedList maxH='xs' overflowY='auto'>
        {data?.data.map((p) => (
          <ListItem key={p.id}>
            <Flex justify='space-between'>
              <Text>{p.rfid}</Text>
              <ProductItemStatusBadge status={p.status} />
            </Flex>
          </ListItem>
        ))}
      </UnorderedList>

      {data?.data.length === 0 && (
        <Text textAlign='center'>
          No{' '}
          <ProductItemStatusBadge
            status={status as unknown as ProductItemDTOStatusEnum}
          />{' '}
          products
        </Text>
      )}
    </>
  );
};
