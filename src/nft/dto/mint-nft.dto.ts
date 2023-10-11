import { IsArray, IsNumber, IsString } from 'class-validator';

export class MintNftDto {
  @IsNumber()
  networkId: number;

  @IsString()
  mintContractAddress: string;

  @IsString()
  privateKey: string;

  @IsString()
  tokenName: string;

  @IsNumber()
  dropId: number;

  @IsNumber()
  merkleQuantity: number;

  @IsNumber()
  quantity: number;

  @IsArray()
  proof: Array<string>;
}
