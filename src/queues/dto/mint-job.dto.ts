import { IsArray, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MintJobDto {
  @ApiProperty({ description: '网络ID', example: 31337 })
  @IsNumber()
  networkId: number;

  @ApiProperty({ type: 'array', items: { type: 'string' } })
  @IsArray()
  privateKeys: string[];

  @ApiProperty({ description: 'nft名称', example: 'PrimaryMarketNFT' })
  @IsString()
  tokenName: string;

  @ApiProperty({
    description: 'nft合约地址',
    example: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  })
  @IsString()
  mintContractAddress: string;

  @ApiProperty({ description: '每个账户mint的数量' })
  @IsNumber()
  mintAmountPerAccount: number;

  @ApiProperty({
    description: 'dropId',
    example: '0x285161a82bc7ae7c2e367b9b162567e1434f268e',
  })
  @IsString()
  dropId: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  lists?: any;

  @ApiProperty({ type: 'string', format: 'binary' })
  proofs?: any;
}
