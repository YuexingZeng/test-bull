import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InitService } from './init.service';
import { InitDto } from './dto/init.dto';

@ApiTags('init')
@Controller('init')
export class InitController {
  constructor(private readonly initService: InitService) {}

  @Post()
  async init(@Body() initDto: InitDto) {
    return await this.initService.init(initDto);
  }
}
