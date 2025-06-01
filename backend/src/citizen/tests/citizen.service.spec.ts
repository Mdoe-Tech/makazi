import { Test, TestingModule } from '@nestjs/testing';
import { CitizenService } from '../citizen.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Citizen } from '../entities/citizen.entity';
import { RegistrationValidationService } from '../services/registration-validation.service';
import { NotificationService } from '../../notification/notification.service';
import { LoggingService } from '../../logging/logging.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { RegistrationStatus } from '../enums/registration-status.enum';

describe('CitizenService', () => {
  let service: CitizenService;
  let repository: Repository<Citizen>;
  let validationService: RegistrationValidationService;
  let notificationService: NotificationService;
  let loggingService: LoggingService;
  let configService: ConfigService;

  const mockCitizen = {
    citizen_id: 1,
    first_name: 'John',
    last_name: 'Doe',
    date_of_birth: new Date('1990-01-01'),
    phone_number: '+255123456789',
    registration_status: RegistrationStatus.PENDING,
    created_at: new Date(),
    updated_at: new Date()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitizenService,
        {
          provide: getRepositoryToken(Citizen),
          useValue: {
            create: jest.fn().mockReturnValue(mockCitizen),
            save: jest.fn().mockResolvedValue(mockCitizen),
            findOne: jest.fn().mockResolvedValue(mockCitizen),
            find: jest.fn().mockResolvedValue([mockCitizen]),
            delete: jest.fn().mockResolvedValue({ affected: 1 })
          }
        },
        {
          provide: RegistrationValidationService,
          useValue: {
            validateStatusTransition: jest.fn(),
            validateApproval: jest.fn(),
            validateRejection: jest.fn()
          }
        },
        {
          provide: NotificationService,
          useValue: {
            sendStatusChangeNotification: jest.fn(),
            sendRejectionNotification: jest.fn()
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

    service = module.get<CitizenService>(CitizenService);
    repository = module.get<Repository<Citizen>>(getRepositoryToken(Citizen));
    validationService = module.get<RegistrationValidationService>(RegistrationValidationService);
    notificationService = module.get<NotificationService>(NotificationService);
    loggingService = module.get<LoggingService>(LoggingService);
    configService = module.get<ConfigService>(ConfigService);
  });

  // ... existing code ...
}); 