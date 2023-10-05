import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('create')
  async create(@Body() createWalletDto: CreateWalletDto): Promise<any> {
    return await this.walletService.create(createWalletDto);
  }

  @Get()
  async findAll(): Promise<any> {
    return await this.walletService.findAll();
  }

  @Get(':walletAddress')
  async findOneByAddress(
    @Param('walletAddress') walletAddress: string,
  ): Promise<any> {
    return await this.walletService.findOneByAddress(walletAddress);
  }

  @Delete(':privateKey')
  async remove(@Param('privateKey') privateKey: string): Promise<any> {
    return await this.walletService.remove(privateKey);
  }
}
