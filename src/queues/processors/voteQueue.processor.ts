import {
  InjectQueue,
  OnGlobalQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { VoteService } from '../../vote/vote.service';
import { NftService } from '../../nft/nft.service';
import { ethers } from 'ethers';
import { VoteDto } from '../../vote/dto/vote.dto';
import {
  getRandomPrivateKey,
  getRandomSeconds,
  removeElementFromArray,
  sliceTokensRandomly,
} from '../../utils/common';
import { VoteJobDto } from '../dto/vote-job.dto';
import { QueuesService } from '../queues.service';
import { UpdateBalanceJobDto } from '../dto/update-balance-job.dto';

@Processor('voteQueue')
export class voteQueueProcessor {
  constructor(
    @InjectQueue('voteQueue') private readonly voteQueue: Queue,
    private readonly voteService: VoteService,
    private readonly nftService: NftService,
    private readonly queuesService: QueuesService,
  ) {}
  @Process('vote')
  async handleVote(job: Job) {
    const privateKey = getRandomPrivateKey(job.data.privateKeys);
    const wallet = new ethers.Wallet(privateKey);
    const address = wallet.address;
    const canVoteNftEntities = await this.nftService.findAllByOwnerAndIsVoted(
      address,
      false,
    );
    const canVoteTokenIds = [];
    for (const canVoteNftEntity of canVoteNftEntities) {
      canVoteTokenIds.push(canVoteNftEntity.tokenNumber);
    }
    if (canVoteTokenIds.length == 0) {
      return {
        privateKey: privateKey,
        current: job.data.current,
      };
    }
    const needed = job.data.target - job.data.current;
    const voteTokens = sliceTokensRandomly(canVoteTokenIds, needed);
    await this.voteService.vote({
      networkId: job.data.networkId,
      voteContractAddress: job.data.voteContractAddress,
      privateKey: privateKey,
      jobId: job.id,
      proposal: job.data.proposalId,
      votee: job.data.votee,
      tokens: voteTokens,
    } as VoteDto);
    await this.queuesService.updateBalance({
      networkId: job.data.networkId,
      walletAddress: address,
    } as UpdateBalanceJobDto);
    return {
      privateKey: privateKey,
      current: job.data.current + voteTokens.length,
    };
  }

  @OnGlobalQueueCompleted()
  async onGlobalCompleted(jobId: number, result: any) {
    const job = await this.voteQueue.getJob(jobId);
    if (typeof result === 'string') {
      try {
        result = JSON.parse(result);
      } catch (error) {
        console.error('Error parsing JSON string:', error);
      }
    }
    if (result.current < job.data.target) {
      const privateKeys = removeElementFromArray(
        job.data.privateKeys,
        result.privateKey,
      );
      if (privateKeys.length == 0) {
        console.log(
          'All accounts have voted, but the expected number of votes has not been reached. Please adjust the parameters and resend the request.',
        );
        return;
      }
      const delay = getRandomSeconds();
      await this.voteQueue.add(
        'vote',
        {
          networkId: job.data.networkId,
          voteContractAddress: job.data.voteContractAddress,
          current: result.current,
          privateKeys: removeElementFromArray(
            job.data.privateKeys,
            result.privateKey,
          ),
          target: job.data.target,
          proposalId: job.data.proposalId,
          votee: job.data.votee,
        } as VoteJobDto,
        {
          delay: delay * 1000,
        },
      );
    } else {
      console.log('Voting has reached the expected quantity, task completed!');
      console.log(`JobId: ${job.id}, Result: ${result}`);
    }
  }
}
