import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MintNftDto } from '../nft/dto/mint-nft.dto';
import { VoteDto } from '../vote/dto/vote.dto';

@Injectable()
export class QueuesService {
  constructor(
    @InjectQueue('nftQueue') private readonly nftQueue: Queue,
    @InjectQueue('voteQueue') private readonly voteQueue: Queue,
  ) {}

  async mint(mintNftDto: MintNftDto) {
    return await this.nftQueue.add('mint', mintNftDto);
  }

  async vote(voteDto: VoteDto) {
    return await this.voteQueue.add('vote', voteDto);
  }
}
