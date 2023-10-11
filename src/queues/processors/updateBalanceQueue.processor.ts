import { OnGlobalQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { BalanceService } from '../../balance/balance.service';
import { NotFoundException } from '@nestjs/common';

@Processor('balanceQueue')
export class balanceQueueProcessor {
  constructor(private readonly balanceService: BalanceService) {}

  @Process('updateBalance')
  async handleUpdateBalance(job: Job) {
    const balance = await this.balanceService.findOneBy(
      job.data.networkId,
      job.data.walletAddress,
    );
    if (!balance) {
      throw new NotFoundException(
        'Balance entity does not exist in database, Please create it first.',
      );
    }
    return await this.balanceService.update(balance.id);
  }

  @OnGlobalQueueFailed()
  async onGlobalFailed(jobId: number, err: Error) {
    console.log(`Job ${jobId} failed! Error: ${err}`);
  }
}
