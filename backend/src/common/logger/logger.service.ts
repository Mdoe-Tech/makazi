import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { LogLevel } from '../../logging/enums/log-level.enum';

@Injectable()
export class CustomLogger implements LoggerService {
  private logger: winston.Logger;

  constructor(private configService: ConfigService) {
    const logLevel = this.configService.get<string>('LOG_LEVEL', 'info');
    const logDir = this.configService.get<string>('LOG_DIR', 'logs');

    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.printf(({ timestamp, level, message, context, trace, ...meta }) => {
          const contextStr = context ? `[${context}]` : '';
          const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
          const traceStr = trace ? `\n${trace}` : '';
          return `${timestamp} [${level}]${contextStr}: ${message} ${metaStr}${traceStr}`;
        }),
      ),
      defaultMeta: { service: 'makazi-api' },
      transports: [
        // Console transport with colors
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
        // Daily rotate file for all logs
        new winston.transports.DailyRotateFile({
          filename: `${logDir}/combined-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
        }),
        // Daily rotate file for error logs
        new winston.transports.DailyRotateFile({
          filename: `${logDir}/error-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          level: 'error',
        }),
        // Daily rotate file for validation errors
        new winston.transports.DailyRotateFile({
          filename: `${logDir}/validation-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          level: 'warn',
        }),
        // Daily rotate file for database queries
        new winston.transports.DailyRotateFile({
          filename: `${logDir}/database-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          level: 'debug',
        }),
      ],
    });
  }

  log(message: string, context?: string, metadata?: any) {
    this.logger.info(message, { context, ...metadata });
  }

  error(message: string, trace?: string, context?: string, metadata?: any) {
    this.logger.error(message, { trace, context, ...metadata });
  }

  warn(message: string, context?: string, metadata?: any) {
    this.logger.warn(message, { context, ...metadata });
  }

  debug(message: string, context?: string, metadata?: any) {
    this.logger.debug(message, { context, ...metadata });
  }

  verbose(message: string, context?: string, metadata?: any) {
    this.logger.verbose(message, { context, ...metadata });
  }
} 