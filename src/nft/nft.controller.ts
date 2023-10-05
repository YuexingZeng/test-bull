import { Controller, Post, Body } from '@nestjs/common';
import { NftService } from './nft.service';
import { MintNftDto } from './dto/mint-nft.dto';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Post()
  mint(@Body() mintNftDto: MintNftDto) {
    return this.nftService.mint(mintNftDto);
  }
}
