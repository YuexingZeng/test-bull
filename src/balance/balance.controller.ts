import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BalanceService } from './balance.service';
import { CreateOrUpdateBalanceDto } from './dto/create-or-update-balance.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('balance')
@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post('createOrUpdate')
  async createOrUpdate(
    @Body() createOrUpdateBalanceDto: CreateOrUpdateBalanceDto,
  ): Promise<any> {
    return await this.balanceService.createOrUpdate(createOrUpdateBalanceDto);
  }

  @Get()
  async findAll(): Promise<any> {
    return await this.balanceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return await this.balanceService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string): Promise<any> {
    return this.balanceService.update(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return await this.balanceService.remove(+id);
  }
}
