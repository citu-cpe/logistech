import { IsUUID } from 'class-validator';

export class AssignCourierToProductItemDTO {
  @IsUUID()
  public courierId: string;
}
