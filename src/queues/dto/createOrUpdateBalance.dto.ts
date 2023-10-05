import { IsNumber, IsString } from 'class-validator';

export class CreateOrUpdateBalanceDto {
  @IsNumber()
  networkId: number;

  @IsString()
  walletAddress: string;
}
