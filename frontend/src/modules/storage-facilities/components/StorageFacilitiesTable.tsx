import {
  Box,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
} from '@chakra-ui/react';
import { CompanyDTO } from 'generated-api';
import { StorageFacilityRow } from './StorageFacilityRow';

interface StorageFacilitiesTableProps {
  storageFacilities: CompanyDTO[];
  available?: boolean;
}

export const StorageFacilitiesTable: React.FC<StorageFacilitiesTableProps> = ({
  storageFacilities,
  available,
}) => {
  return (
    <Box>
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>Company</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {storageFacilities.map((s) => (
              <StorageFacilityRow
                key={s.id}
                storageFacility={s}
                available={available}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
