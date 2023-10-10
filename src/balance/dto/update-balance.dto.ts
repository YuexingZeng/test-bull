import { PartialType } from '@nestjs/swagger';
import { CreateOrUpdateBalanceDto } from './create-or-update-balance.dto';

export class UpdateBalanceDto extends PartialType(CreateOrUpdateBalanceDto) {}
