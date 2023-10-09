import { Body, Controller, Post } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { MintNftDto } from '../nft/dto/mint-nft.dto';
import { VoteJobDto } from './dto/vote-job.dto';

@Controller('queues')
export class QueuesController {
  constructor(private readonly queuesService: QueuesService) {}

  @Post('mint')
  async mint(@Body() mintNftDto: MintNftDto) {
    return await this.queuesService.mint(mintNftDto);
  }

  @Post('vote')
  async vote(@Body() voteJobDto: VoteJobDto) {
    return await this.queuesService.vote(voteJobDto);
  }
}
