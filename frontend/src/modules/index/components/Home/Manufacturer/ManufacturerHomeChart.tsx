import { Box, ChakraProps } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';

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

const chartjsData = {
  labels,
  datasets: [
    {
      label: 'Ordered',
      data: data.map((d) => d.ordered),
      backgroundColor: '#38B2AC',
    },
    {
      label: 'Manufactured',
      data: data.map((d) => d.manufactured),
      backgroundColor: '#285E61',
    },
    {
      label: 'Sold',
      data: data.map((d) => d.sold),
      backgroundColor: '#1D4044',
    },
  ],
};

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
  return (
    <Box {...props}>
      <Bar options={options} data={chartjsData} />
    </Box>
  );
};
