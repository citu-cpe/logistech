import { Badge } from "native-base";
import { CompanyDTOTypeEnum } from "generated-api";

interface CompanyTypeBadgeProps {
  companyType: CompanyDTOTypeEnum;
}

export const CompanyTypeBadge: React.FC<CompanyTypeBadgeProps> = ({
  companyType,
}) => {
  let colorScheme = "";

  switch (companyType) {
    case CompanyDTOTypeEnum.Retailer:
      colorScheme = "yellow";
      break;
    case CompanyDTOTypeEnum.Supplier:
      colorScheme = "blue";
      break;
    case CompanyDTOTypeEnum.Manufacturer:
      colorScheme = "green";
      break;
    case CompanyDTOTypeEnum.StorageFacility:
      colorScheme = "red";
      break;
  }

  return (
    <Badge colorScheme={colorScheme} my="2">
      {companyType.replaceAll("_", " ")}
    </Badge>
  );
};
