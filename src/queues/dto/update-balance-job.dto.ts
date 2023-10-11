import { IsNumber, IsString } from 'class-validator';

export class UpdateBalanceJobDto {
  @IsNumber()
  networkId: number;

  @IsString()
  walletAddress: string;
}
