import { Tr, Td, Text, Tooltip } from '@chakra-ui/react';
import { ReportDTO } from 'generated-api';

interface ReportRowProps {
  report: ReportDTO;
}

export const ReportRow: React.FC<ReportRowProps> = ({ report }) => {
  return (
    <Tr>
      <Td>{report.reportedBy.username}</Td>
      <Td>{report.productItem.product?.name}</Td>
      <Td>{report.productItem.rfid}</Td>
      <Td>
        <Tooltip label={report.description}>
          <Text
            maxW='xs'
            overflow='hidden'
            textOverflow='ellipsis'
            whiteSpace='nowrap'
          >
            {report.description}
          </Text>
        </Tooltip>
      </Td>
    </Tr>
  );
};
