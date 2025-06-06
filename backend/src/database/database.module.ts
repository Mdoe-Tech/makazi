import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from '../config/typeorm.config';
import { QueryLoggerSubscriber } from '../common/subscribers/query-logger.subscriber';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [
    ConfigModule,
    LoggingModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...getTypeOrmConfig(configService),
        subscribers: [QueryLoggerSubscriber],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [QueryLoggerSubscriber],
})
export class DatabaseModule {} 