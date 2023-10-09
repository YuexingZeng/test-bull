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

@Entity({ name: 'vote_record' })
export class VoteRecordEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'job_id' })
  jobId: number;

  @ManyToOne(() => NetworkEntity, (network) => network.voteRecords, {
    cascade: true,
  })
  @JoinColumn({ name: 'network_id' })
  network: NetworkEntity;

  @ManyToOne(() => WalletEntity, (wallet) => wallet.voteRecords, {
    cascade: true,
  })
  @JoinColumn({ name: 'wallet_id' })
  wallet: WalletEntity;

  @Column({ default: 0 })
  count: number;

  @Column({ name: 'transaction_hash' })
  transactionHash: string;

  @Column({ name: 'proposal_id' })
  proposalId: number;

  @Column({ name: 'votee' })
  votee: number;
}
