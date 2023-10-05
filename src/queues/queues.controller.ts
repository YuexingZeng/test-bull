import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrUpdateBalanceDto } from './dto/createOrUpdateBalance.dto';
import { QueuesService } from './queues.service';

@Controller('queues')
export class QueuesController {
  constructor(private readonly queuesService: QueuesService) {}

  @Post('createOrUpdateBalance')
  async createOrUpdateBalance(
    @Body() createOrUpdateBalanceDto: CreateOrUpdateBalanceDto,
  ) {
    return await this.queuesService.createOrUpdateBalance(
      createOrUpdateBalanceDto,
    );
  }
}
