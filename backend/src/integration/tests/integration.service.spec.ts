import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationService } from '../integration.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IntegrationConfig, IntegrationType, IntegrationStatus } from '../entities/integration-config.entity';
import { LoggingService } from '../../logging/logging.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

describe('IntegrationService', () => {
  let service: IntegrationService;
  let repository: Repository<IntegrationConfig>;
  let loggingService: LoggingService;
  let configService: ConfigService;

  const mockIntegrationConfig = {
    config_id: 1,
    type: IntegrationType.NIDA,
    name: 'NIDA Integration',
    config: {
      api_key: 'test_key',
      api_url: 'https://api.nida.go.tz'
    },
    status: IntegrationStatus.ACTIVE,
    is_active: true,
    updated_by: 1,
    created_at: new Date(),
    updated_at: new Date()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntegrationService,
        {
          provide: getRepositoryToken(IntegrationConfig),
          useValue: {
            create: jest.fn().mockReturnValue(mockIntegrationConfig),
            save: jest.fn().mockResolvedValue(mockIntegrationConfig),
            findOne: jest.fn().mockResolvedValue(mockIntegrationConfig),
            find: jest.fn().mockResolvedValue([mockIntegrationConfig])
          }
        },
        {
          provide: LoggingService,
          useValue: {
            log: jest.fn(),
            error: jest.fn()
          }
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue: any) => defaultValue)
          }
        }
      ]
    }).compile();

    service = module.get<IntegrationService>(IntegrationService);
    repository = module.get<Repository<IntegrationConfig>>(getRepositoryToken(IntegrationConfig));
    loggingService = module.get<LoggingService>(LoggingService);
    configService = module.get<ConfigService>(ConfigService);
  });

  // ... existing code ...
}); 