import { PartialType } from '@nestjs/swagger';
import { MintNftDto } from './mint-nft.dto';

export class UpdateNftDto extends PartialType(MintNftDto) {}
