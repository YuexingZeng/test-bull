import { Module } from '@nestjs/common';
import { InitController } from './init.controller';
import { InitService } from './init.service';
import { NetworkModule } from '../network/network.module';
import { WalletModule } from '../wallet/wallet.module';
import { BalanceModule } from '../balance/balance.module';

@Module({
  imports: [NetworkModule, WalletModule, BalanceModule],
  controllers: [InitController],
  providers: [InitService],
})
export class InitModule {}
