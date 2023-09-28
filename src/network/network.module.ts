import { Module } from '@nestjs/common';
import { NetworkService } from './network.service';
import { NetworkController } from './network.controller';
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
  ],
  controllers: [NetworkController],
  providers: [NetworkService],
})
export class NetworkModule {}
