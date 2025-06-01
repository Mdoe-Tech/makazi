import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    DatabaseService,
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (databaseService: DatabaseService) => {
        return databaseService;
      },
      inject: [DatabaseService],
    },
  ],
  exports: [DatabaseService, 'DATABASE_CONNECTION'],
})
export class DatabaseModule {} 