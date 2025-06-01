import { Injectable } from '@nestjs/common';
import { CustomLogger } from '../common/logger/logger.service';

@Injectable()
export class LoggingService {
  constructor(private logger: CustomLogger) {}

  log(message: string) {
    this.logger.log(message);
  }

  error(message: string, trace: string) {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
} 