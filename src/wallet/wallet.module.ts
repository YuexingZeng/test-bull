import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseEntity } from '../entities/base';
import { BalanceEntity } from '../entities/balance.entity';
import { NetworkEntity } from '../entities/network.entity';
import { NftEntity } from '../entities/nft.entity';
import { WalletEntity } from '../entities/wallet.entity';
import { VoteRecordEntity } from '../entities/vote.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BaseEntity,
      BalanceEntity,
      NetworkEntity,
      NftEntity,
      WalletEntity,
      VoteRecordEntity,
    ]),
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
