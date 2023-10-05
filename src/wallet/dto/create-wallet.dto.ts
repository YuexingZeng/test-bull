import { IsNumber } from 'class-validator';

export class CreateWalletDto {
  @IsNumber()
  groupNumber: number;

  @IsNumber()
  childWalletAmount: number;
}
