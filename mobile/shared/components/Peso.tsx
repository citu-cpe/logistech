import { Text } from "native-base";

interface PesoProps {
  amount: number;
  color?: string;
  fontWeight?: string;
}
export const Peso: React.FC<PesoProps> = ({ amount, color, fontWeight }) => {
  return (
    <Text color={color} fontWeight={fontWeight}>
      &#8369; {amount.toFixed(2)}
    </Text>
  );
};
