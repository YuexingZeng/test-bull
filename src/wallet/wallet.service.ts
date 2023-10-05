import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { ethers } from 'ethers';
import { WalletEntity } from '../entities/wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly wallet: Repository<WalletEntity>,
  ) {}

  async create(createWalletDto: CreateWalletDto): Promise<any> {
    const groupNumber = createWalletDto.groupNumber;
    const childWalletAmount = createWalletDto.childWalletAmount;
    const createdWalletRecords: string[] = [];
    for (let i = 0; i < groupNumber; i++) {
      const hdNode = ethers.HDNodeWallet.createRandom();
      const groupParentWallet = hdNode;
      const parentWallet = new WalletEntity();
      parentWallet.walletAddress = groupParentWallet.address;
      const childWalletList = [];
      const groupChildWallets = [];
      for (let j = 0; j < childWalletAmount; j++) {
        const childWallet = hdNode.derivePath(`m/44'/60'/0'/0/${j}`);
        groupChildWallets.push({
          index: j,
          privateKey: childWallet.privateKey,
          address: childWallet.address,
        });
        const child = new WalletEntity();
        child.walletAddress = childWallet.address;
        child.parentWallet = parentWallet;
        await this.wallet.save(child);
        childWalletList.push(child);
      }
      const fileContent = JSON.stringify({
        groupCounter: i,
        parent: {
          mnemonic: groupParentWallet.mnemonic.phrase,
          privateKey: groupParentWallet.privateKey,
          address: groupParentWallet.address,
        },
        children: groupChildWallets,
      });
      createdWalletRecords.push(fileContent);
      parentWallet.subWallets = childWalletList;
      await this.wallet.save(parentWallet);
    }
    return createdWalletRecords;
  }

  async findAll(): Promise<any> {
    return await this.wallet.findAndCount({ relations: ['subWallets'] });
  }

  async findOneByAddress(walletAddress: string): Promise<any> {
    const entity = await this.wallet.findOne({
      where: {
        walletAddress: Like(walletAddress),
      },
      relations: [
        'subWallets',
        'balances',
        'nfts',
        'parentWallet',
        'voteRecords',
      ],
    });
    if (!entity) {
      throw new NotFoundException('Account does not exist in database');
    }
    return entity;
  }

  async remove(privateKey: string): Promise<any> {
    const wallet = new ethers.Wallet(privateKey);
    const address = wallet.address;
    const entity = await this.findOneByAddress(address);
    return await this.wallet.remove(entity);
  }
}
