import { BaseEntity } from './base';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BalanceEntity } from './balance.entity';
import { NftEntity } from './nft.entity';
import { VoteRecordEntity } from './vote.entity';

@Entity({ name: 'wallet' })
export class WalletEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'wallet_address' })
  walletAddress: string;

  @OneToMany(() => BalanceEntity, (balanceEntity) => balanceEntity.wallet)
  balances: BalanceEntity[];

  @OneToMany(() => NftEntity, (nftEntity) => nftEntity.ownerWallet)
  nfts: NftEntity[];

  @ManyToOne(() => WalletEntity, (wallet) => wallet.subWallets, {
    cascade: true,
  })
  @JoinColumn({ name: 'parent_wallet' })
  parentWallet: WalletEntity;

  @OneToMany(() => WalletEntity, (walletEntity) => walletEntity.parentWallet)
  subWallets: WalletEntity[];

  @OneToMany(() => VoteRecordEntity, (voteRecord) => voteRecord.wallet)
  voteRecords: VoteRecordEntity[];
}
