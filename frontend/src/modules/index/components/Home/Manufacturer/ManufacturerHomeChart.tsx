import { Box, ChakraProps } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import { getCssVariable } from '../../../../../shared/utils/cssVariables';

interface ChartData {
  date: string;
  ordered: number;
  manufactured: number;
  sold: number;
}

const data: ChartData[] = [
  { date: '02/23', ordered: 25, manufactured: 35, sold: 30 },
  { date: '03/23', ordered: 25, manufactured: 35, sold: 45 },
  { date: '04/23', ordered: 15, manufactured: 25, sold: 45 },
];

const labels = data.map((d) => d.date);

const options = {
  responsive: true,
  width: '100%',
  scales: {
    y: {
      title: {
        display: true,
        text: 'Processed',
      },
    },
  },
};

export const ManufacturerHomeChart = (props: ChakraProps) => {
  const chartjsData = {
    labels,
    datasets: [
      {
        label: 'Ordered',
        data: data.map((d) => d.ordered),
        backgroundColor: getCssVariable('--chakra-colors-teal-400'),
      },
      {
        label: 'Manufactured',
        data: data.map((d) => d.manufactured),
        backgroundColor: getCssVariable('--chakra-colors-teal-700'),
      },
      {
        label: 'Sold',
        data: data.map((d) => d.sold),
        backgroundColor: getCssVariable('--chakra-colors-teal-900'),
      },
    ],
  };

  return (
    <Box {...props}>
      <Bar options={options} data={chartjsData} />
    </Box>
  );
};
