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

@Entity({ name: 'balance' })
export class BalanceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 9, scale: 2, default: 0 })
  balance: number;

  @ManyToOne(() => NetworkEntity, (network) => network.wallets, {
    cascade: true,
  })
  @JoinColumn({ name: 'network_id' })
  network: NetworkEntity;

  @ManyToOne(() => WalletEntity, (wallet) => wallet.balances, {
    cascade: true,
  })
  @JoinColumn({ name: 'wallet_id' })
  wallet: WalletEntity;
}
