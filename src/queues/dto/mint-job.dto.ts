import { IsArray, IsNumber } from 'class-validator';

export class MintJobDto {
  @IsNumber()
  networkId: number;

  @IsArray()
  privateKeys: Array<string>;

  @IsNumber()
  mintAmountPerAccount: number;

  @IsNumber()
  dropId: number;
}
