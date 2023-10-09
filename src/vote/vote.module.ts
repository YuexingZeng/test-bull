import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { NetworkModule } from '../network/network.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NetworkEntity } from '../entities/network.entity';
import { BalanceEntity } from '../entities/balance.entity';
import { NftEntity } from '../entities/nft.entity';
import { WalletEntity } from '../entities/wallet.entity';
import { VoteRecordEntity } from '../entities/vote.entity';
import { BaseEntity } from '../entities/base';
import { WalletModule } from '../wallet/wallet.module';
import { NftModule } from '../nft/nft.module';

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
    NftModule,
  ],
  controllers: [VoteController],
  providers: [VoteService],
  exports: [VoteService],
})
export class VoteModule {}
