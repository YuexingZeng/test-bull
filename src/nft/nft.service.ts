import { Injectable } from '@nestjs/common';
import { MintNftDto } from './dto/mint-nft.dto';
import { Contract, ethers, JsonRpcProvider } from 'ethers';
import * as ABI from './contract/abi.json';
import { NetworkService } from '../network/network.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class NftService {
  constructor(private readonly networkService: NetworkService) {}

  async mint(mintNftDto: MintNftDto) {
    const contractInstance = await this.getMintContract();
    return await contractInstance.mint(
      mintNftDto.dropId,
      mintNftDto.merkleQuantity,
      mintNftDto.quantity,
      mintNftDto.proof,
    );
  }

  async getMintContract(): Promise<Contract> {
    const privateKey = process.env.privateKey;
    const chainId = process.env.chainId;
    const mintContractAddress = process.env.mintContractAddress;
    const networkEntity = await this.networkService.findOne(+chainId);
    const provider = new JsonRpcProvider(networkEntity.url);
    const signer = new ethers.Wallet(privateKey, provider);
    return new ethers.Contract(mintContractAddress, ABI, signer);
  }
}
