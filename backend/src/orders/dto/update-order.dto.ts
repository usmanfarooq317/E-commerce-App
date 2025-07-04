import { IsInt, IsPositive } from 'class-validator';

export class UpdateOrderDto {
  @IsInt()
  @IsPositive()
  quantity: number;
}
