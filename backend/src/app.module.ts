import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { CitizenModule } from './citizen/citizen.module';
import { DocumentModule } from './document/document.module';
import { BiometricModule } from './biometric/biometric.module';
import { NotificationModule } from './notification/notification.module';
import { AuditModule } from './audit/audit.module';
import { ReportingModule } from './reporting/reporting.module';
import { SystemConfigModule } from './config/system-config.module';
import { IntegrationModule } from './integration/integration.module';
import { LoggingModule } from './logging/logging.module';
import { NidaModule } from './nida/nida.module';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { ValidationFilter } from './common/filters/validation.filter';
import { QueryLoggerSubscriber } from './common/subscribers/query-logger.subscriber';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    AdminModule,
    CitizenModule,
    DocumentModule,
    BiometricModule,
    NotificationModule,
    AuditModule,
    ReportingModule,
    SystemConfigModule,
    IntegrationModule,
    LoggingModule,
    NidaModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ValidationFilter,
    },
    AppService,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes('*');
  }
}
