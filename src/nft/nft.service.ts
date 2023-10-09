import { Injectable, NotFoundException } from '@nestjs/common';
import { MintNftDto } from './dto/mint-nft.dto';
import { Contract, ethers, Wallet } from 'ethers';
import * as ABI from './contract/abi.json';
import { NetworkService } from '../network/network.service';
import * as dotenv from 'dotenv';
import { WalletService } from '../wallet/wallet.service';
import { getTokensFromTx, getTxReceipt } from '../utils/common';
import { NftEntity } from '../entities/nft.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
dotenv.config();

@Injectable()
export class NftService {
  constructor(
    @InjectRepository(NftEntity)
    private readonly nft: Repository<NftEntity>,
    private readonly networkService: NetworkService,
    private readonly walletService: WalletService,
  ) {}

  async mint(mintNftDto: MintNftDto) {
    const { provider, signer } = await this.networkService.getProviderAndSigner(
      mintNftDto.privateKey,
      mintNftDto.networkId,
    );
    const contractInstance = await this.getMintContract(signer);
    const txResult = await contractInstance.mint(
      mintNftDto.dropId,
      mintNftDto.merkleQuantity,
      mintNftDto.quantity,
      mintNftDto.proof,
    );
    const response = await getTxReceipt(provider, txResult.hash);
    const tokens = getTokensFromTx(response);
    const nftEntitys = [];
    for (const token of tokens) {
      const walletEntity = await this.walletService.findOneByAddress(
        signer.address,
      );
      const networkEntity = await this.networkService.findOne(
        +process.env.chainId,
      );
      const nftEntity = new NftEntity();
      nftEntity.name = process.env.tokenName;
      nftEntity.tokenNumber = token;
      nftEntity.ownerWallet = walletEntity;
      nftEntity.network = networkEntity;
      nftEntitys.push(await this.nft.save(nftEntity));
    }
    return nftEntitys;
  }

  async findAllByOwnerAndIsVoted(
    walletAddress: string,
    isVoted: boolean,
  ): Promise<NftEntity[]> {
    const queryBuilder = this.nft
      .createQueryBuilder('nft')
      .where('nft.isVoted = :isVoted', { isVoted }) // 使用 :isVoted 来引用参数
      .innerJoinAndSelect('nft.ownerWallet', 'wallet') // 连接 ownerWallet 关联
      .andWhere('wallet.walletAddress = :walletAddress', { walletAddress });
    return await queryBuilder.getMany();
  }

  async findOneByTokenId(tokenId: number) {
    const entity = await this.nft.findOne({
      where: {
        tokenNumber: Like(tokenId),
      },
      relations: ['network', 'ownerWallet'],
    });
    if (!entity) {
      throw new NotFoundException('The nft does not exist in database');
    }
    return entity;
  }

  async updateVotedState(tokenId: number, isVoted: boolean) {
    const existNftEntity = await this.findOneByTokenId(tokenId);
    this.nft.merge(existNftEntity, { isVoted: isVoted });
    return await this.nft.save(existNftEntity);
  }

  async getMintContract(signer: Wallet): Promise<Contract> {
    const mintContractAddress = process.env.mintContractAddress;
    return new ethers.Contract(mintContractAddress, ABI, signer);
  }
}
