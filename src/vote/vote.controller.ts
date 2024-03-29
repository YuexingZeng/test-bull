import { Controller, Post, Body } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteDto } from './dto/vote.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('vote')
@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post()
  async vote(@Body() voteDto: VoteDto): Promise<any> {
    return await this.voteService.vote(voteDto);
  }
}
