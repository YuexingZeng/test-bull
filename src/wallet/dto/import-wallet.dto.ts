import { IsNumber, IsString } from 'class-validator';

export class ImportWalletDto {
  @IsString()
  mnemonic: string;

  @IsNumber()
  childWalletAmount: number;
}
