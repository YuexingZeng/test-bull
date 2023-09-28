import { Module } from '@nestjs/common';
import { MyQueueModule } from './my-queue/my-queue.module';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import redisConfig from './config/redis.config';
import { BullModule } from '@nestjs/bull';
import { InitModule } from './init/init.module';
import { NetworkModule } from './network/network.module';
import { WalletModule } from './wallet/wallet.module';
import { NftModule } from './nft/nft.module';
import { VoteModule } from './vote/vote.module';
import mysqlConfig from './config/mysql.config';
dotenv.config();

@Module({
  imports: [
    MyQueueModule,
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mysqlConfig, redisConfig],
      envFilePath: [`.env.${process.env.NODE_ENV}`],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...(await configService.get('mysql')),
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...(await configService.get('redis')),
      }),
      inject: [ConfigService],
    }),
    InitModule,
    NetworkModule,
    WalletModule,
    NftModule,
    VoteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
