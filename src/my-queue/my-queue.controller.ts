import { InjectQueue } from '@nestjs/bull';
import { Controller, Post } from '@nestjs/common';
import { Queue } from 'bull';

@Controller('my-queue')
export class MyQueueController {
  constructor(@InjectQueue('my-queue') private readonly myQueue: Queue) {}

  @Post('transcode')
  async transcode() {
    await this.myQueue.add('transcode', {
      file: 'audio.mp3',
    });
  }
}
