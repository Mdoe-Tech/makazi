import { Injectable } from '@nestjs/common';
import { CustomLogger } from '../common/logger/logger.service';

@Injectable()
export class LoggingService {
  constructor(private logger: CustomLogger) {}

  log(message: string, context?: string, metadata?: any) {
    this.logger.log(message, context, metadata);
  }

  error(message: string, trace?: string, context?: string, metadata?: any) {
    this.logger.error(message, trace, context, metadata);
  }

  warn(message: string, context?: string, metadata?: any) {
    this.logger.warn(message, context, metadata);
  }

  debug(message: string, context?: string, metadata?: any) {
    this.logger.debug(message, context, metadata);
  }

  verbose(message: string, context?: string, metadata?: any) {
    this.logger.verbose(message, context, metadata);
  }
} 