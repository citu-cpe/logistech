import { Box, ChakraProps, useBreakpointValue } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useGlobalStore } from '../../../../../shared/stores';
import { getCssVariable } from '../../../../../shared/utils/cssVariables';
import { useGetManufacturerChartData } from '../../../hooks/useGetManufacturerChartData';

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
  const height = useBreakpointValue({ base: 200, md: 150 }, { ssr: false });
  const getUser = useGlobalStore((state) => state.getUser);
  const companyId = getUser()?.company?.id;
  const { data } = useGetManufacturerChartData(companyId);

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
          label: 'Ordered',
          data: data?.data.map((d) => d.ordered),
          backgroundColor: getCssVariable('--chakra-colors-teal-400'),
        },
        {
          label: 'Manufactured',
          data: data?.data.map((d) => d.manufactured),
          backgroundColor: getCssVariable('--chakra-colors-teal-700'),
        },
        {
          label: 'Sold',
          data: data?.data.map((d) => d.sold),
          backgroundColor: getCssVariable('--chakra-colors-teal-900'),
        },
      ],
    };

    setChartjsData(newChartjsData);
  }, [data]);

  return (
    <Box {...props}>
      {chartjsData && (
        <Bar data={chartjsData} options={options} height={height} />
      )}
    </Box>
  );
};
