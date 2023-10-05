import { Module } from '@nestjs/common';
import { QueuesController } from './queues.controller';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseEntity } from '../entities/base';
import { BalanceEntity } from '../entities/balance.entity';
import { NetworkEntity } from '../entities/network.entity';
import { NftEntity } from '../entities/nft.entity';
import { WalletEntity } from '../entities/wallet.entity';
import { VoteRecordEntity } from '../entities/vote.entity';
import { QueuesService } from './queues.service';
import { WalletModule } from '../wallet/wallet.module';
import { NetworkModule } from '../network/network.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'balanceQueue',
    }),
    BullBoardModule.forFeature({
      name: 'balanceQueue',
      adapter: BullAdapter,
    }),
    TypeOrmModule.forFeature([
      BaseEntity,
      BalanceEntity,
      NetworkEntity,
      NftEntity,
      WalletEntity,
      VoteRecordEntity,
    ]),
    WalletModule,
    NetworkModule,
  ],
  controllers: [QueuesController],
  providers: [QueuesService],
})
export class QueuesModule {}
