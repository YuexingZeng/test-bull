import { IsArray, IsNumber, IsString } from 'class-validator';

export class MintJobDto {
  @IsNumber()
  networkId: number;

  @IsArray()
  privateKeys: Array<string>;

  @IsString()
  tokenName: string;

  @IsString()
  mintContractAddress: string;

  @IsNumber()
  mintAmountPerAccount: number;

  @IsNumber()
  dropId: number;
}
