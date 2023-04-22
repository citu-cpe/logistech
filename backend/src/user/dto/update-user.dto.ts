import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsString()
  @IsNotEmpty()
  public address: string;
}
