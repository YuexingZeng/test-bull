import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { VoteJobDto } from './dto/vote-job.dto';
import { MintJobDto } from './dto/mint-job.dto';

@Injectable()
export class QueuesService {
  constructor(
    @InjectQueue('nftQueue') private readonly nftQueue: Queue,
    @InjectQueue('voteQueue') private readonly voteQueue: Queue,
  ) {}

  async mint(mintJobDto: MintJobDto) {
    return await this.nftQueue.add('mint', mintJobDto);
  }

  async vote(voteJobDto: VoteJobDto) {
    return await this.voteQueue.add('vote', voteJobDto);
  }
}
