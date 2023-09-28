import { BaseEntity } from './base';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NetworkEntity } from './network.entity';
import { WalletEntity } from './wallet.entity';

@Entity({ name: 'nft' })
export class NftEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'token_number' })
  tokenNumber: number;

  @ManyToOne(() => NetworkEntity, (network) => network.nfts, {
    cascade: true,
  })
  @JoinColumn({ name: 'network_id' })
  network: NetworkEntity;

  @ManyToOne(() => WalletEntity, (wallet) => wallet.nfts, {
    cascade: true,
  })
  @JoinColumn({ name: 'owner_wallet_id' })
  ownerWallet: WalletEntity;
}
