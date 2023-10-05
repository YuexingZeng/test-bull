import { Injectable } from '@nestjs/common';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { NetworkService } from '../network/network.service';
import { WalletService } from '../wallet/wallet.service';
import { BalanceEntity } from '../entities/balance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { NetworkEntity } from '../entities/network.entity';
import { WalletEntity } from '../entities/wallet.entity';
import { ethers } from 'ethers';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(BalanceEntity)
    private readonly balance: Repository<BalanceEntity>,
    @InjectRepository(NetworkEntity)
    private readonly network: Repository<NetworkEntity>,
    @InjectRepository(WalletEntity)
    private readonly wallet: Repository<WalletEntity>,
    private readonly networkService: NetworkService,
    private readonly walletService: WalletService,
  ) {}

  async create(createBalanceDto: CreateBalanceDto): Promise<BalanceEntity> {
    const networkEntity = await this.networkService.findOne(
      createBalanceDto.networkId,
    );
    const walletEntity = await this.walletService.findOneByAddress(
      createBalanceDto.walletAddress,
    );
    const provider = new ethers.JsonRpcProvider(networkEntity.url);
    const balanceEther = ethers.formatEther(
      await provider.getBalance(walletEntity.walletAddress),
    );
    const balanceEntity = new BalanceEntity();
    balanceEntity.wallet = walletEntity;
    balanceEntity.network = networkEntity;
    balanceEntity.balance = +balanceEther;
    return await this.balance.save(balanceEntity);
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
