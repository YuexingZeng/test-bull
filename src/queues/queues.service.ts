import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { VoteJobDto } from './dto/vote-job.dto';
import { MintJobDto } from './dto/mint-job.dto';
import { UpdateBalanceJobDto } from './dto/update-balance-job.dto';

@Injectable()
export class QueuesService {
  constructor(
    @InjectQueue('nftQueue') private readonly nftQueue: Queue,
    @InjectQueue('voteQueue') private readonly voteQueue: Queue,
    @InjectQueue('balanceQueue') private readonly balanceQueue: Queue,
  ) {}

  async mint(csvData: string, proofData: string, mintJobDto: MintJobDto) {
    console.log(mintJobDto.privateKeys);
    return await this.nftQueue.add('mint', {
      lists: csvData,
      proofs: proofData,
      networkId: mintJobDto.networkId,
      privateKeys: mintJobDto.privateKeys,
      tokenName: mintJobDto.tokenName,
      mintContractAddress: mintJobDto.mintContractAddress,
      mintAmountPerAccount: mintJobDto.mintAmountPerAccount,
      dropId: mintJobDto.dropId,
    });
  }

  async vote(voteJobDto: VoteJobDto) {
    return await this.voteQueue.add('vote', voteJobDto);
  }

  async updateBalance(updateBalanceJobDto: UpdateBalanceJobDto) {
    return await this.balanceQueue.add('updateBalance', updateBalanceJobDto);
  }
}
