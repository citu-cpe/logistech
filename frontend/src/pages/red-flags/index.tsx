import { Box, Heading } from '@chakra-ui/react';
import { RedFlagTable } from '../../modules/red-flags/components/RedFlagTable';

const RedFlags = () => {
  return (
    <Box>
      <Heading mb='6'>Red Flags</Heading>
      <RedFlagTable />
    </Box>
  );
};

export default RedFlags;
