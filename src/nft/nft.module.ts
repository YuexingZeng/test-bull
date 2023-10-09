import { Module } from '@nestjs/common';
import { NftService } from './nft.service';
import { NftController } from './nft.controller';
import { NetworkModule } from '../network/network.module';
import { WalletModule } from '../wallet/wallet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NetworkEntity } from '../entities/network.entity';
import { BalanceEntity } from '../entities/balance.entity';
import { NftEntity } from '../entities/nft.entity';
import { WalletEntity } from '../entities/wallet.entity';
import { VoteRecordEntity } from '../entities/vote.entity';
import { BaseEntity } from '../entities/base';

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
  controllers: [NftController],
  providers: [NftService],
  exports: [NftService],
})
export class NftModule {}
