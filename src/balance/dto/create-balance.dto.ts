import { IsNumber, IsString } from 'class-validator';

export class CreateBalanceDto {
  @IsNumber()
  networkId: number;

  @IsString()
  walletAddress: string;
}
