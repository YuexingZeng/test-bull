import { OnGlobalQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { NftService } from '../../nft/nft.service';
import { ethers } from 'ethers';
import { checkAddressInWhiteList, getMerkleProof } from '../../utils/common';
import { MintNftDto } from '../../nft/dto/mint-nft.dto';

import { QueuesService } from '../queues.service';
import { UpdateBalanceJobDto } from '../dto/update-balance-job.dto';

@Processor('nftQueue')
export class nftQueueProcessor {
  constructor(
    private readonly nftService: NftService,
    private readonly queuesService: QueuesService,
  ) {}

  @Process('mint')
  async handleMint(job: Job) {
    const handleResult = [];
    for (const privateKey of job.data.privateKeys) {
      const wallet = new ethers.Wallet(privateKey);
      const address = wallet.address;
      const { found, amount } = await checkAddressInWhiteList(address);
      if (found) {
        const proof = await getMerkleProof(address);
        this.nftService
          .mint({
            networkId: job.data.networkId,
            mintContractAddress: job.data.mintContractAddress,
            privateKey: privateKey,
            tokenName: job.data.tokenName,
            dropId: job.data.dropId,
            merkleQuantity: amount,
            quantity: job.data.mintAmountPerAccount,
            proof: proof,
          } as MintNftDto)
          .then((result) => {
            this.queuesService.updateBalance({
              networkId: job.data.networkId,
              walletAddress: address,
            } as UpdateBalanceJobDto);
            handleResult.push({
              networkId: job.data.networkId,
              account: address,
              mintAmount: result.length,
            });
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    }
    return handleResult;
  }

  @OnGlobalQueueCompleted()
  async onGlobalCompleted(jobId: number, result: any) {
    console.log(`Job ${jobId} completed! Result: ${result}`);
  }
}
