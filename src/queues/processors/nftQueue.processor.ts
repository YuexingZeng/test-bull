import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { NftService } from '../../nft/nft.service';

@Processor('nftQueue')
export class nftQueueProcessor {
  constructor(private readonly nftService: NftService) {}
  @Process('mint')
  async handleMint(job: Job) {
    await this.nftService.mint(job.data);
  }
}
