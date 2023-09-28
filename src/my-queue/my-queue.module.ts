import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MyQueueController } from './my-queue.controller';
import { myQueueProcessor } from './my-queue.processor';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'my-queue',
    }),
    BullBoardModule.forFeature({
      name: 'my-queue',
      adapter: BullAdapter,
    }),
  ],
  providers: [myQueueProcessor],
  controllers: [MyQueueController],
})
export class MyQueueModule {}
