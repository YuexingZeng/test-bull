import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrUpdateBalanceDto {
  @ApiProperty({
    description: 'The network id of the balance',
  })
  @IsNumber()
  networkId: number;

  @ApiProperty({
    description: 'The wallet address of the balance',
  })
  @IsString()
  walletAddress: string;
}
