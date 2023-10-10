import { Controller, Post, Body } from '@nestjs/common';
import { NftService } from './nft.service';
import { MintNftDto } from './dto/mint-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('nft')
@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Post()
  mint(@Body() mintNftDto: MintNftDto) {
    return this.nftService.mint(mintNftDto);
  }

  @Post('update')
  updateVotedState(@Body() updateNftDto: UpdateNftDto) {
    return this.nftService.updateVotedState(
      updateNftDto.tokenId,
      updateNftDto.isVoted,
    );
  }
}
