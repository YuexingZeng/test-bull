import { BaseEntity } from './base';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { BalanceEntity } from './balance.entity';
import { NftEntity } from './nft.entity';
import { VoteRecordEntity } from './vote.entity';

@Entity({ name: 'network' })
export class NetworkEntity extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @OneToMany(() => BalanceEntity, (balanceEntity) => balanceEntity.network)
  wallets: BalanceEntity[];

  @OneToMany(() => NftEntity, (nftEntity) => nftEntity.network)
  nfts: NftEntity[];

  @OneToMany(() => VoteRecordEntity, (voteRecord) => voteRecord.network)
  voteRecords: VoteRecordEntity[];
}
