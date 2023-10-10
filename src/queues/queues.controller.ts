import { Body, Controller, Post } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { VoteJobDto } from './dto/vote-job.dto';
import { MintJobDto } from './dto/mint-job.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('queues')
@Controller('queues')
export class QueuesController {
  constructor(private readonly queuesService: QueuesService) {}

  @Post('mint')
  async mint(@Body() mintJobDto: MintJobDto) {
    return await this.queuesService.mint(mintJobDto);
  }

  @Post('vote')
  async vote(@Body() voteJobDto: VoteJobDto) {
    return await this.queuesService.vote(voteJobDto);
  }
}
