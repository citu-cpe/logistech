import { Box, ChakraProps, useBreakpointValue } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useAuthStore } from '../../../../../shared/stores';
import { getCssVariable } from '../../../../../shared/utils/cssVariables';
import { useGetRetailerChartData } from '../../../hooks/useGetRetailerChartData';

const options = {
  responsive: true,
  width: '100%',
};

export const RetailerHomeChart = (props: ChakraProps) => {
  const height = useBreakpointValue({ base: 300, md: 100 }, { ssr: false });
  const { companyId } = useAuthStore();
  const { data } = useGetRetailerChartData(companyId);

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
          label: 'Cost',
          data: data?.data.map((d) => d.cost),
          borderColor: getCssVariable('--chakra-colors-teal-400'),
          backgroundColor: getCssVariable('--chakra-colors-teal-400'),
        },
        {
          label: 'Profit',
          data: data?.data.map((d) => d.profit),
          borderColor: getCssVariable('--chakra-colors-teal-700'),
          backgroundColor: getCssVariable('--chakra-colors-teal-700'),
        },
      ],
    };

    setChartjsData(newChartjsData);
  }, [data]);

  return (
    <Box w='full' {...props}>
      {chartjsData && (
        <Line options={options} data={chartjsData} height={height} />
      )}
    </Box>
  );
};
