import { IsNumber, IsString } from 'class-validator';

export class InitDto {
  @IsNumber()
  networkId: number;

  @IsString()
  networkName: string;

  @IsString()
  networkProviderUrl: string;

  @IsString()
  mnemonic: string;

  @IsNumber()
  childWalletAmount: number;

  @IsNumber()
  TransferAmount: number;
}
