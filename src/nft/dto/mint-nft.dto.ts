import { IsArray, IsNumber } from 'class-validator';

export class MintNftDto {
  @IsNumber()
  dropId: number;
  @IsNumber()
  merkleQuantity: number;
  @IsNumber()
  quantity: number;
  @IsArray()
  proof: Array<string>;
}
