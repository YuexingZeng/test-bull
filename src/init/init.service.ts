import { Injectable } from '@nestjs/common';
import { InitDto } from './dto/init.dto';
import { NetworkService } from '../network/network.service';
import { CreateNetworkDto } from '../network/dto/create-network.dto';
import { WalletService } from '../wallet/wallet.service';
import { BalanceService } from '../balance/balance.service';
import { CreateOrUpdateBalanceDto } from '../balance/dto/create-or-update-balance.dto';
import { transferETH } from '../utils/common';

@Injectable()
export class InitService {
  constructor(
    private readonly networkService: NetworkService,
    private readonly walletService: WalletService,
    private readonly balanceService: BalanceService,
  ) {}
  async init(initDto: InitDto) {
    const networkEntity = await this.networkService.create({
      id: initDto.networkId,
      name: initDto.networkName,
      url: initDto.networkProviderUrl,
    } as CreateNetworkDto);
    const groupWallets = await this.walletService.importAndSaveWallet(
      initDto.mnemonic,
      initDto.childWalletAmount,
    );
    for (const child of groupWallets.children) {
      const { provider, signer } =
        await this.networkService.getProviderAndSigner(
          groupWallets.parent.privateKey,
          initDto.networkId,
        );
      await transferETH(
        provider,
        signer,
        child.address,
        initDto.TransferAmount.toString(),
      );
    }
    await this.balanceService.createOrUpdate({
      networkId: initDto.networkId,
      walletAddress: groupWallets.parent.address,
    } as CreateOrUpdateBalanceDto);
    for (const child of groupWallets.children) {
      await this.balanceService.createOrUpdate({
        networkId: initDto.networkId,
        walletAddress: child.address,
      } as CreateOrUpdateBalanceDto);
    }
    return {
      networkInfo: networkEntity,
      walletInfo: groupWallets,
    };
  }
}
