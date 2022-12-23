import { Box } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';

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

const data = {
  labels: Array.from(Array(n)).map(() => ''),
  datasets: [
    {
      label: 'Sales',
      data: Array.from(Array(n)).map(() => Math.floor(Math.random() * 101)),
      backgroundColor: '#38B2AC',
    },
  ],
};

export const SupplierHomeChart = () => {
  return (
    <Box w='full'>
      <Bar data={data} options={options} height={70}></Bar>
    </Box>
  );
};
