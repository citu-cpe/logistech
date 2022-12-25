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
import { LinkCard } from '../../../../../shared/components/LinkCard';
import { StatusList } from '../../../../../shared/components/StatusList';
import { RetailerHomeChart } from './RetailerHomeChart';

export const Retailer = () => {
  const flexBasis = { base: '47%', md: '21%' };
  const showAccordion = useBreakpointValue({ base: true, md: false });

  return (
    <Box>
      <RetailerHomeChart mb='8' />

      <Box rounded='md' backgroundColor='gray.900' p='6'>
        <Flex justify='space-between' mb='8' flexWrap='wrap' rowGap='6'>
          <LinkCard
            title='On Hold'
            n='nn'
            href='/on-hold'
            flexBasis={flexBasis}
          />
          <LinkCard
            title='New Arrival'
            n='n'
            href='/new-arrival'
            flexBasis={flexBasis}
          />
          <LinkCard
            title='In Transit'
            n='n'
            href='/in-transit'
            flexBasis={flexBasis}
          />
          <LinkCard
            title='Couriers'
            n='n'
            href='/couriers'
            flexBasis={flexBasis}
          />
        </Flex>

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

        <StatusList />
      </Box>

      <Box rounded='md' backgroundColor='gray.700' p='6' flexBasis='47%'>
        <Heading size='md' textAlign='center' mb='4'>
          Return Handling
        </Heading>

        <StatusList />
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
          <StatusList />
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
          <StatusList />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
