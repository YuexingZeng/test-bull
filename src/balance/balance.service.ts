import { Injectable } from '@nestjs/common';
import { NetworkService } from '../network/network.service';
import { WalletService } from '../wallet/wallet.service';
import { BalanceEntity } from '../entities/balance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ethers } from 'ethers';
import { CreateOrUpdateBalanceDto } from './dto/create-or-update-balance.dto';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(BalanceEntity)
    private readonly balance: Repository<BalanceEntity>,
    private readonly networkService: NetworkService,
    private readonly walletService: WalletService,
  ) {}

  async createOrUpdate(
    createOrUpdateBalanceDto: CreateOrUpdateBalanceDto,
  ): Promise<BalanceEntity> {
    const networkEntity = await this.networkService.findOne(
      createOrUpdateBalanceDto.networkId,
    );
    const walletEntity = await this.walletService.findOneByAddress(
      createOrUpdateBalanceDto.walletAddress,
    );
    const provider = new ethers.JsonRpcProvider(networkEntity.url);
    const balanceEther = ethers.formatEther(
      await provider.getBalance(walletEntity.walletAddress),
    );
    if (!(await this.ifExists(networkEntity.id, walletEntity.walletAddress))) {
      const balanceEntity = new BalanceEntity();
      balanceEntity.wallet = walletEntity;
      balanceEntity.network = networkEntity;
      balanceEntity.balance = +balanceEther;
      return await this.balance.save(balanceEntity);
    } else {
      const existingBalance = await this.findOneBy(
        networkEntity.id,
        walletEntity.walletAddress,
      );
      this.balance.merge(existingBalance, { balance: +balanceEther });
      return await this.balance.save(existingBalance);
    }
  }

  async findAll(): Promise<any> {
    return await this.balance.find();
  }

  async findOne(id: number): Promise<BalanceEntity> {
    return await this.balance.findOne({
      where: {
        id: Like(id),
      },
      relations: ['network', 'wallet'],
    });
  }

  async findOneBy(networkId: number, walletAddress: string) {
    const queryBuilder = this.balance
      .createQueryBuilder('balance')
      .innerJoinAndSelect('balance.network', 'network') // 连接 ownerWallet 关联
      .innerJoinAndSelect('balance.wallet', 'wallet')
      .where('network.id = :networkId', { networkId })
      .andWhere('wallet.walletAddress = :walletAddress', { walletAddress });
    return await queryBuilder.getOne();
  }

  async ifExists(networkId: number, walletAddress: string): Promise<boolean> {
    const queryBuilder = this.balance
      .createQueryBuilder('balance')
      .innerJoinAndSelect('balance.network', 'network') // 连接 ownerWallet 关联
      .innerJoinAndSelect('balance.wallet', 'wallet')
      .where('network.id = :networkId', { networkId })
      .andWhere('wallet.walletAddress = :walletAddress', { walletAddress });
    return await queryBuilder.getExists();
  }

  async update(id: number): Promise<BalanceEntity> {
    const existingBalance = await this.findOne(id);
    const provider = new ethers.JsonRpcProvider(existingBalance.network.url);
    const balanceEther = ethers.formatEther(
      await provider.getBalance(existingBalance.wallet.walletAddress),
    );
    this.balance.merge(existingBalance, { balance: +balanceEther });
    return await this.balance.save(existingBalance);
  }

  async remove(id: number): Promise<BalanceEntity> {
    const existingBalance = await this.findOne(id);
    return await this.balance.remove(existingBalance);
  }
}
