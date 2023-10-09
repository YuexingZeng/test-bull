import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNetworkDto } from './dto/create-network.dto';
import { UpdateNetworkDto } from './dto/update-network.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NetworkEntity } from '../entities/network.entity';
import { Like, Repository } from 'typeorm';
import { ethers, JsonRpcProvider } from 'ethers';

@Injectable()
export class NetworkService {
  constructor(
    @InjectRepository(NetworkEntity)
    private readonly network: Repository<NetworkEntity>,
  ) {}

  async create(createNetworkDto: CreateNetworkDto): Promise<NetworkEntity> {
    const networkEntity = new NetworkEntity();
    networkEntity.id = createNetworkDto.id;
    networkEntity.name = createNetworkDto.name;
    networkEntity.url = createNetworkDto.url;
    return await this.network.save(networkEntity);
  }

  async findAll(): Promise<NetworkEntity[]> {
    return await this.network.find();
  }

  async findOne(id: number): Promise<NetworkEntity | undefined> {
    const network = await this.network.findOne({
      where: {
        id: Like(id),
      },
      relations: ['wallets', 'nfts', 'voteRecords'],
    });
    if (!network) {
      throw new NotFoundException(`Network with id ${id} not found`);
    }
    return network;
  }

  async update(
    id: number,
    updateNetworkDto: UpdateNetworkDto,
  ): Promise<NetworkEntity> {
    const existingNetwork = await this.findOne(id);
    this.network.merge(existingNetwork, updateNetworkDto);
    return await this.network.save(existingNetwork);
  }

  async remove(id: number): Promise<void> {
    const existingNetwork = await this.findOne(id);
    await this.network.remove(existingNetwork);
  }

  async getProviderAndSigner(privateKey: string, chainId: number) {
    const networkEntity = await this.findOne(chainId);
    const provider = new JsonRpcProvider(networkEntity.url);
    const signer = new ethers.Wallet(privateKey, provider);
    return {
      provider: provider,
      signer: signer,
    };
  }
}
