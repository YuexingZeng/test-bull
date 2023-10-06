import { Body, Controller, Post } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { MintNftDto } from '../nft/dto/mint-nft.dto';
import { VoteDto } from '../vote/dto/vote.dto';

@Controller('queues')
export class QueuesController {
  constructor(private readonly queuesService: QueuesService) {}

  @Post('mint')
  async mint(@Body() mintNftDto: MintNftDto) {
    return await this.queuesService.mint(mintNftDto);
  }

  @Post('vote')
  async vote(@Body() voteDto: VoteDto) {
    return await this.queuesService.vote(voteDto);
  }
}
