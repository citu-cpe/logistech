import { Box, Heading } from '@chakra-ui/react';
import { ReportTable } from '../../modules/reports/components/ReportTable';

const Reports = () => {
  return (
    <Box>
      <Heading mb='6'>Reports</Heading>
      <ReportTable />
    </Box>
  );
};

export default Reports;
