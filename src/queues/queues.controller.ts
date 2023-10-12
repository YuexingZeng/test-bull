import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { QueuesService } from './queues.service';
import { VoteJobDto } from './dto/vote-job.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('queues')
@Controller('queues')
export class QueuesController {
  constructor(private readonly queuesService: QueuesService) {}

  @Post('mint')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      // 👈  multiple files with different field names
      { name: 'lists', maxCount: 1 },
      { name: 'proofs', maxCount: 1 },
      { name: 'mintJob', maxCount: 1 },
    ]),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        // 👈  field names need to be repeated for swagger
        lists: {
          type: 'string',
          format: 'binary',
        },
        proofs: {
          type: 'string',
          format: 'binary',
        },
        mintJob: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async mint(@UploadedFiles() files) {
    return await this.queuesService.mint(
      files.lists[0].buffer.toString(),
      files.proofs[0].buffer.toString(),
      files.mintJob[0].buffer.toString(),
    );
  }

  @Post('vote')
  async vote(@Body() voteJobDto: VoteJobDto) {
    return await this.queuesService.vote(voteJobDto);
  }
}
