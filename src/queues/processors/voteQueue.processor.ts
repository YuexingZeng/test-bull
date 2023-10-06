import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { VoteService } from '../../vote/vote.service';

@Processor('voteQueue')
export class voteQueueProcessor {
  constructor(private readonly voteService: VoteService) {}
  @Process('vote')
  async handleVote(job: Job) {
    await this.voteService.vote(job.data);
  }
}
