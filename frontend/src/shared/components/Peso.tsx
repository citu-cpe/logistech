import { Text } from '@chakra-ui/react';

interface PesoProps {
  amount: number;
}
export const Peso: React.FC<PesoProps> = ({ amount }) => {
  return <Text display='inline'>&#8369; {amount.toFixed(2)}</Text>;
};
