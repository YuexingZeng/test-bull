import { Injectable } from '@nestjs/common';
import { Contract, ethers, JsonRpcProvider } from 'ethers';
import { NetworkService } from '../network/network.service';
import * as ABI from './contract/abi.json';
import { VoteDto } from './dto/vote.dto';

@Injectable()
export class VoteService {
  constructor(private readonly networkService: NetworkService) {}

  async vote(voteDto: VoteDto) {
    const contractInstance = await this.getVoteContract();
    return await contractInstance.vote(
      voteDto.proposal,
      voteDto.votee,
      voteDto.tokens,
    );
  }

  async getVoteContract(): Promise<Contract> {
    const privateKey = process.env.privateKey;
    const chainId = process.env.chainId;
    const voteContractAddress = process.env.voteContractAddress;
    const networkEntity = await this.networkService.findOne(+chainId);
    const provider = new JsonRpcProvider(networkEntity.url);
    const signer = new ethers.Wallet(privateKey, provider);
    return new ethers.Contract(voteContractAddress, ABI, signer);
  }
}
