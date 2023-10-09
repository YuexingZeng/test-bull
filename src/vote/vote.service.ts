import { Injectable } from '@nestjs/common';
import { Contract, ethers, Wallet } from 'ethers';
import { NetworkService } from '../network/network.service';
import * as ABI from './contract/abi.json';
import { VoteDto } from './dto/vote.dto';
import { getTxReceipt } from '../utils/common';
import { WalletService } from '../wallet/wallet.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VoteRecordEntity } from '../entities/vote.entity';
import { NftService } from '../nft/nft.service';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(VoteRecordEntity)
    private readonly voteRecord: Repository<VoteRecordEntity>,
    private readonly networkService: NetworkService,
    private readonly walletService: WalletService,
    private readonly nftService: NftService,
  ) {}

  async vote(voteDto: VoteDto) {
    const { provider, signer } =
      await this.networkService.getProviderAndSigner();
    const contractInstance = await this.getVoteContract(signer);
    const txResult = await contractInstance.vote(
      voteDto.proposal,
      voteDto.votee,
      voteDto.tokens,
    );
    const response = await getTxReceipt(provider, txResult.hash);
    for (const tokenId of voteDto.tokens) {
      await this.nftService.updateVotedState(tokenId, true);
    }
    const networkEntity = await this.networkService.findOne(
      +process.env.chainId,
    );
    const walletEntity = await this.walletService.findOneByAddress(
      signer.address,
    );
    const voteRecordEntity = new VoteRecordEntity();
    voteRecordEntity.votee = voteDto.votee;
    voteRecordEntity.count = voteDto.tokens.length;
    voteRecordEntity.jobId = voteDto.jobId;
    voteRecordEntity.transactionHash = response.hash;
    voteRecordEntity.proposalId = voteDto.proposal;
    voteRecordEntity.network = networkEntity;
    voteRecordEntity.wallet = walletEntity;
    return await this.voteRecord.save(voteRecordEntity);
  }

  async getVoteContract(signer: Wallet): Promise<Contract> {
    const voteContractAddress = process.env.voteContractAddress;
    return new ethers.Contract(voteContractAddress, ABI, signer);
  }
}
