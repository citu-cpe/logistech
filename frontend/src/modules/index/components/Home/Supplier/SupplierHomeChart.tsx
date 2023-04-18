import { Box, useBreakpointValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useGlobalStore } from '../../../../../shared/stores';
import { getCssVariable } from '../../../../../shared/utils/cssVariables';
import { useGetSupplierChartData } from '../../../hooks/useGetSupplierChartData';

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

export const SupplierHomeChart = () => {
  const height = useBreakpointValue({ base: 200, md: 100 }, { ssr: false });
  const getUser = useGlobalStore((state) => state.getUser);
  const companyId = getUser()?.company?.id;
  const { data } = useGetSupplierChartData(companyId);
  const [chartjsData, setChartjsData] = useState<{
    labels: string[] | undefined;
    datasets: {
      label: string;
      data: number[] | undefined;
      backgroundColor: string;
    }[];
  }>();

  useEffect(() => {
    const newChartjsData = {
      labels: data?.data.map((d) => d.date),
      datasets: [
        {
          label: 'Sales',
          data: data?.data.map((d) => d.sales),
          backgroundColor: getCssVariable('--chakra-colors-teal-400'),
        },
      ],
    };

    setChartjsData(newChartjsData);
  }, [data]);

  return (
    <Box w='full'>
      {chartjsData && (
        <Bar data={chartjsData} options={options} height={height}></Bar>
      )}
    </Box>
  );
};
