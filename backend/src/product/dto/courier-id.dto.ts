import { IsOptional, IsUUID } from 'class-validator';

export class CourierIdDTO {
  @IsUUID()
  @IsOptional()
  public courierId?: string;
}
