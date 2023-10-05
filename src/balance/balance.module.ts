import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NetworkEntity } from '../entities/network.entity';
import { BalanceEntity } from '../entities/balance.entity';
import { NftEntity } from '../entities/nft.entity';
import { WalletEntity } from '../entities/wallet.entity';
import { VoteRecordEntity } from '../entities/vote.entity';
import { BaseEntity } from '../entities/base';
import { NetworkModule } from '../network/network.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NetworkEntity,
      BalanceEntity,
      NftEntity,
      WalletEntity,
      VoteRecordEntity,
      BaseEntity,
    ]),
    NetworkModule,
    WalletModule,
  ],
  controllers: [BalanceController],
  providers: [BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}
