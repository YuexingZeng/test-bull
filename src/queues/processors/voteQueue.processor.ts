import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { VoteService } from '../../vote/vote.service';
import { NftService } from '../../nft/nft.service';
import { WalletService } from '../../wallet/wallet.service';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import { VoteDto } from '../../vote/dto/vote.dto';
dotenv.config();

@Processor('voteQueue')
export class voteQueueProcessor {
  constructor(
    private readonly voteService: VoteService,
    private readonly nftService: NftService,
    private readonly walletService: WalletService,
  ) {}
  @Process('vote')
  async handleVote(job: Job) {
    const wallet = new ethers.Wallet(process.env.privateKey);
    const address = wallet.address;
    const canVoteNftEntities = await this.nftService.findAllByOwnerAndIsVoted(
      address,
      false,
    );
    const canVoteTokenIds = [];
    for (const canVoteNftEntity of canVoteNftEntities) {
      canVoteTokenIds.push(canVoteNftEntity.tokenNumber);
    }
    await this.voteService.vote({
      jobId: job.id,
      proposal: job.data.proposalId,
      votee: job.data.votee,
      tokens: canVoteTokenIds,
    } as VoteDto);
  }
}
