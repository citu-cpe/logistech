import { Box } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';

interface ChartData {
  date: string;
  stored: number;
  shipped: number;
}

const data: ChartData[] = [
  {
    date: '02/2023',
    stored: 20,
    shipped: 20,
  },
  {
    date: '03/2023',
    stored: 10,
    shipped: 10,
  },
  {
    date: '04/2023',
    stored: 18,
    shipped: 15,
  },
  {
    date: '05/2023',
    stored: 20,
    shipped: 25,
  },
];

const options = {
  responsive: true,
  width: '100%',
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
      title: {
        display: true,
        text: 'Processed',
      },
    },
  },
};

const labels = data.map((d) => d.date);

const chartjsData = {
  labels,
  datasets: [
    {
      label: 'Shipped',
      data: data.map((d) => d.shipped),
      backgroundColor: '#38B2AC',
    },
    {
      label: 'Stored',
      data: data.map((d) => d.stored),
      backgroundColor: '#285E61',
    },
  ],
};

export const StorageFacilityHomeChart = () => {
  return (
    <Box w='full'>
      <Bar options={options} data={chartjsData} height={100} />
    </Box>
  );
};
