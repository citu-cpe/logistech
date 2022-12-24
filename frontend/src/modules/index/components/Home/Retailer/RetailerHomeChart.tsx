import { Box, ChakraProps } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import { getCssVariable } from '../../../../../shared/utils/cssVariables';

interface ChartData {
  date: string;
  cost: number;
  profit: number;
}

const data: ChartData[] = [
  { date: '02/23', cost: 100, profit: 90 },
  { date: '03/23', cost: 75, profit: 100 },
  { date: '04/23', cost: 80, profit: 70 },
  { date: '05/23', cost: 95, profit: 80 },
  { date: '05/23', cost: 95, profit: 110 },
  { date: '05/23', cost: 70, profit: 110 },
];

const labels = data.map((d) => d.date);

const options = {
  responsive: true,
  width: '100%',
};

export const RetailerHomeChart = (props: ChakraProps) => {
  const chartjsData = {
    labels,
    datasets: [
      {
        label: 'Cost',
        data: data.map((d) => d.cost),
        borderColor: getCssVariable('--chakra-colors-teal-400'),
        backgroundColor: getCssVariable('--chakra-colors-teal-400'),
      },
      {
        label: 'Profit',
        data: data.map((d) => d.profit),
        borderColor: getCssVariable('--chakra-colors-teal-700'),
        backgroundColor: getCssVariable('--chakra-colors-teal-700'),
      },
    ],
  };

  return (
    <Box w='full' {...props}>
      <Line options={options} data={chartjsData} height={50} />
    </Box>
  );
};
