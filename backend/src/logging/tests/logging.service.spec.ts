import { Test, TestingModule } from '@nestjs/testing';
import { LoggingService } from '../logging.service';
import { CustomLogger } from '../../common/logger/logger.service';
import { ConfigService } from '@nestjs/config';

describe('LoggingService', () => {
  let service: LoggingService;
  let logger: CustomLogger;
  let configService: ConfigService;

  beforeEach(async () => {
    const mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggingService,
        {
          provide: CustomLogger,
          useValue: mockLogger,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue: any) => defaultValue)
          }
        }
      ],
    }).compile();

    service = module.get<LoggingService>(LoggingService);
    logger = module.get<CustomLogger>(CustomLogger);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('log', () => {
    it('should log info messages', () => {
      const message = 'Test info message';
      service.log(message);
      expect(logger.log).toHaveBeenCalledWith(message);
    });
  });

  describe('error', () => {
    it('should log error messages with trace', () => {
      const message = 'Error occurred';
      const trace = 'Error stack trace';
      service.error(message, trace);
      expect(logger.error).toHaveBeenCalledWith(message, trace);
    });

    it('should log error messages without trace', () => {
      const message = 'Error occurred';
      service.error(message, '');
      expect(logger.error).toHaveBeenCalledWith(message, '');
    });
  });

  describe('warn', () => {
    it('should log warning messages', () => {
      const message = 'Test warning message';
      service.warn(message);
      expect(logger.warn).toHaveBeenCalledWith(message);
    });
  });

  describe('debug', () => {
    it('should log debug messages', () => {
      const message = 'Test debug message';
      service.debug(message);
      expect(logger.debug).toHaveBeenCalledWith(message);
    });
  });

  describe('verbose', () => {
    it('should log verbose messages', () => {
      const message = 'Test verbose message';
      service.verbose(message);
      expect(logger.verbose).toHaveBeenCalledWith(message);
    });
  });
}); 