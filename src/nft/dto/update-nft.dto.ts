import { PartialType } from '@nestjs/swagger';
import { MintNftDto } from './mint-nft.dto';
import { IsNumber } from 'class-validator';

export class UpdateNftDto extends PartialType(MintNftDto) {
  @IsNumber()
  tokenId: number;

  @IsNumber()
  isVoted: boolean;
}
