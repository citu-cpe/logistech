import { IsNumber } from 'class-validator';

export class ProductItemStatusQuantityDTO {
  @IsNumber()
  public onHold: number;

  @IsNumber()
  public inTransit: number;

  @IsNumber()
  public inStorage: number;

  @IsNumber()
  public toBePickedUp: number;

  @IsNumber()
  public complete: number;

  @IsNumber()
  public canceled: number;

  @IsNumber()
  public redFlag: number;

  @IsNumber()
  public orders: number;
}
