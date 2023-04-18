import { Box, useBreakpointValue } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useGlobalStore } from '../../../../../shared/stores';
import { getCssVariable } from '../../../../../shared/utils/cssVariables';
import { useGetStorageFacilityChartData } from '../../../hooks/useGetStorageFacilityChartData';

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

export const StorageFacilityHomeChart = () => {
  const height = useBreakpointValue({ base: 300, md: 100 }, { ssr: false });
  const getUser = useGlobalStore((state) => state.getUser);
  const companyId = getUser()?.company?.id;
  const { data } = useGetStorageFacilityChartData(companyId);

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
          label: 'Shipped',
          data: data?.data.map((d) => d.shipped),
          backgroundColor: getCssVariable('--chakra-colors-teal-400'),
        },
        {
          label: 'Stored',
          data: data?.data.map((d) => d.stored),
          backgroundColor: getCssVariable('--chakra-colors-teal-700'),
        },
      ],
    };

    setChartjsData(newChartjsData);
  }, [data]);

  return (
    <Box w='full'>
      {chartjsData && (
        <Bar options={options} data={chartjsData} height={height} />
      )}
    </Box>
  );
};
