import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateReportDTO {
  @IsString()
  @IsNotEmpty()
  public description: string;

  @IsUUID()
  public productItemId: string;
}
