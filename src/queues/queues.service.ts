import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateOrUpdateBalanceDto } from './dto/createOrUpdateBalance.dto';
import { NetworkService } from '../network/network.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class QueuesService {
  constructor(
    @InjectQueue('balanceQueue') private readonly balanceQueue: Queue,
    private readonly networkService: NetworkService,
    private readonly walletService: WalletService,
  ) {}

  async createOrUpdateBalance(
    createOrUpdateBalanceDto: CreateOrUpdateBalanceDto,
  ) {
    const networkEntity = await this.networkService.findOne(
      createOrUpdateBalanceDto.networkId,
    );
    const walletEntity = await this.walletService.findOneByAddress(
      createOrUpdateBalanceDto.walletAddress,
    );
    return await this.balanceQueue.add('createOrUpdateBalance', {
      networkEntity: networkEntity,
      walletEntity: walletEntity,
    });
  }
}
