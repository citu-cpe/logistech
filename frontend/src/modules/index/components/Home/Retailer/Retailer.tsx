import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  ProductItemByStatusDTOStatusEnum,
  ProductItemDTOStatusEnum,
} from 'generated-api';
import { LinkCard } from '../../../../../shared/components/LinkCard';
import { StatusList } from '../../../../../shared/components/StatusList';
import { useAuthStore } from '../../../../../shared/stores';
import { useGetProductItemStatusQuantity } from '../../../hooks/useGetProductItemStatusQuantity';
import { RetailerHomeChart } from './RetailerHomeChart';

export const Retailer = () => {
  const flexBasis = { base: '47%', md: '21%' };
  const showAccordion = useBreakpointValue({ base: true, md: false });
  const { companyId } = useAuthStore();
  const { data } = useGetProductItemStatusQuantity(companyId);

  return (
    <Box>
      <RetailerHomeChart mb='8' />

      <Box rounded='md' backgroundColor='gray.900' p='6'>
        {data?.data && (
          <Flex justify='space-between' mb='8' flexWrap='wrap' rowGap='6'>
            <LinkCard
              title='On Hold'
              n={data.data.onHold}
              href={`/products/product-items?status=${ProductItemDTOStatusEnum.OnHold}`}
              flexBasis={flexBasis}
            />
            <LinkCard
              title='In Transit To Storage Facility'
              n={data.data.inTransitToStorageFacility}
              href={`/products/product-items?status=${ProductItemDTOStatusEnum.InTransitToStorageFacility}`}
              flexBasis={flexBasis}
            />
            <LinkCard
              title='In Transit To Buyer'
              n={data.data.inTransitToBuyer}
              href={`/products/product-items?status=${ProductItemDTOStatusEnum.InTransitToBuyer}`}
              flexBasis={flexBasis}
            />
          </Flex>
        )}

        {showAccordion ? <AccordionComponent /> : <FlexComponent />}
      </Box>
    </Box>
  );
};

const FlexComponent = () => {
  return (
    <Flex justify='space-between'>
      <Box rounded='md' backgroundColor='gray.700' p='6' flexBasis='47%'>
        <Heading size='md' textAlign='center' mb='4'>
          Currently Ordered
        </Heading>

        <StatusList status={ProductItemByStatusDTOStatusEnum.OnHold} />
      </Box>

      <Box rounded='md' backgroundColor='gray.700' p='6' flexBasis='47%'>
        <Heading size='md' textAlign='center' mb='4'>
          Return Handling
        </Heading>

        <StatusList status={ProductItemByStatusDTOStatusEnum.Returned} />
      </Box>
    </Flex>
  );
};

const AccordionComponent = () => {
  return (
    <Accordion allowMultiple>
      <AccordionItem>
        <AccordionButton>
          <Text
            as='span'
            flex='1'
            textAlign='left'
            fontWeight='semibold'
            fontSize='lg'
          >
            Currently Ordered
          </Text>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel pb={4}>
          <StatusList status={ProductItemByStatusDTOStatusEnum.OnHold} />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionButton>
          <Text
            as='span'
            flex='1'
            textAlign='left'
            fontWeight='semibold'
            fontSize='lg'
          >
            Return Handling
          </Text>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <StatusList status={ProductItemByStatusDTOStatusEnum.Canceled} />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
