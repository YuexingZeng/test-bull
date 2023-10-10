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
    const createdWalletRecords = [];
    for (let i = 0; i < groupNumber; i++) {
      const hdNode = ethers.HDNodeWallet.createRandom();
      const groupWallets = await this.importAndSaveWallet(
        hdNode.mnemonic.phrase,
        childWalletAmount,
      );
      createdWalletRecords.push({
        groupCounter: i,
        parent: groupWallets.parent,
        children: groupWallets.children,
      });
    }
    return createdWalletRecords;
  }

  async importAndSaveWallet(mnemonic: string, childWalletAmount: number) {
    const hdNode = ethers.Wallet.fromPhrase(mnemonic);
    const groupParentWallet = hdNode;
    const ifExists = await this.ifExists(groupParentWallet.address);
    let parentWallet: WalletEntity;
    if (ifExists) {
      parentWallet = await this.findOneByAddress(groupParentWallet.address);
    } else {
      parentWallet = new WalletEntity();
      parentWallet.walletAddress = groupParentWallet.address;
    }
    const groupChildWallets = [];
    for (let j = 0; j < childWalletAmount; j++) {
      const childWallet = hdNode.derivePath(`m/44'/60'/0'/0/${j}`);
      groupChildWallets.push({
        index: j,
        privateKey: childWallet.privateKey,
        address: childWallet.address,
      });
      if (!(await this.ifExists(childWallet.address))) {
        const child = new WalletEntity();
        child.walletAddress = childWallet.address;
        child.parentWallet = parentWallet;
        await this.wallet.save(child);
      }
    }
    return {
      parent: {
        mnemonic: groupParentWallet.mnemonic.phrase,
        privateKey: groupParentWallet.privateKey,
        address: groupParentWallet.address,
      },
      children: groupChildWallets,
    };
  }

  async findAll(): Promise<any> {
    return await this.wallet.findAndCount({ relations: ['subWallets'] });
  }

  async findOneByAddress(walletAddress: string): Promise<WalletEntity> {
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

  async ifExists(walletAddress: string): Promise<boolean> {
    return await this.wallet.exist({
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
  }

  async remove(privateKey: string): Promise<WalletEntity> {
    const wallet = new ethers.Wallet(privateKey);
    const address = wallet.address;
    const entity = await this.findOneByAddress(address);
    return await this.wallet.remove(entity);
  }
}
