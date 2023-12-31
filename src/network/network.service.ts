import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNetworkDto } from './dto/create-network.dto';
import { UpdateNetworkDto } from './dto/update-network.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NetworkEntity } from '../entities/network.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class NetworkService {
  constructor(
    @InjectRepository(NetworkEntity)
    private readonly network: Repository<NetworkEntity>,
  ) {}

  async create(createNetworkDto: CreateNetworkDto): Promise<NetworkEntity> {
    const newNetwork = this.network.create(createNetworkDto);
    return await this.network.save(newNetwork);
  }

  async findAll(): Promise<NetworkEntity[]> {
    return await this.network.find();
  }

  async findOne(id: number): Promise<NetworkEntity | undefined> {
    const network = await this.network.findOne({
      where: {
        id: Like(id),
      },
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
}
