import { Box, useBreakpointValue } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import { getCssVariable } from '../../../../../shared/utils/cssVariables';

export const options = {
  responsive: true,
  width: '100%',
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      title: {
        display: true,
        text: 'Sales',
      },
    },
  },
};

const n = 50;

export const SupplierHomeChart = () => {
  const height = useBreakpointValue({ base: 200, md: 100 }, { ssr: false });
  const data = {
    labels: Array.from(Array(n)).map(() => ''),
    datasets: [
      {
        label: 'Sales',
        data: Array.from(Array(n)).map(() => Math.floor(Math.random() * 101)),
        backgroundColor: getCssVariable('--chakra-colors-teal-400'),
      },
    ],
  };

  return (
    <Box w='full'>
      <Bar data={data} options={options} height={height}></Bar>
    </Box>
  );
};
