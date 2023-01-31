import { IsUUID } from 'class-validator';

export class LogoutUserDTO {
  @IsUUID()
  public id: string;
}
