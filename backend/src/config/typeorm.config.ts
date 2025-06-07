import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { QueryLoggerSubscriber } from '../common/subscribers/query-logger.subscriber';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', '@Issaally99'),
  database: configService.get('DB_DATABASE', 'makazi'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: configService.get('NODE_ENV') === 'development',
  ssl: configService.get('DB_SSL') === 'true' ? {
    rejectUnauthorized: false
  } : false,
  subscribers: [QueryLoggerSubscriber],
  migrations: [__dirname + '/../**/migrations/*{.ts,.js}'],
  migrationsRun: true,
  migrationsTableName: 'migrations'
}); 