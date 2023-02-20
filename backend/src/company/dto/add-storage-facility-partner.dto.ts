import { IsUUID } from 'class-validator';

export class AddStorageFacilityPartnerDTO {
  @IsUUID(undefined, { each: true })
  public storageFacilityIds: string[];
}
