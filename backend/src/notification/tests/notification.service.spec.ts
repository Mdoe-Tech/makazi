import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from '../notification.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notification } from '../entities/notification.entity';
import { NotificationStatus } from '../enums/notification.enum';
import { NotificationType } from '../enums/notification-type.enum';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { LoggingService } from '../../logging/logging.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

describe('NotificationService', () => {
  let service: NotificationService;
  let repository: Repository<Notification>;
  let loggingService: LoggingService;
  let configService: ConfigService;

  const mockNotification = {
    notification_id: 1,
    recipient_id: 1,
    recipient_type: 'citizen',
    type: NotificationType.STATUS_CHANGE,
    title: 'Test Notification',
    message: 'Test Message',
    status: NotificationStatus.PENDING,
    metadata: {
      old_status: 'PENDING',
      new_status: 'APPROVED'
    },
    created_at: new Date(),
    updated_at: new Date()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getRepositoryToken(Notification),
          useValue: {
            create: jest.fn().mockReturnValue(mockNotification),
            save: jest.fn().mockResolvedValue(mockNotification),
            findOne: jest.fn().mockResolvedValue(mockNotification),
            find: jest.fn().mockResolvedValue([mockNotification]),
            update: jest.fn().mockResolvedValue({ affected: 1 })
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

    service = module.get<NotificationService>(NotificationService);
    repository = module.get<Repository<Notification>>(getRepositoryToken(Notification));
    loggingService = module.get<LoggingService>(LoggingService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new notification', async () => {
      const createDto: CreateNotificationDto = {
        recipient_id: 1,
        recipient_type: 'citizen',
        type: NotificationType.STATUS_CHANGE,
        title: 'Test Notification',
        message: 'Test Message',
        metadata: {
          old_status: 'PENDING',
          new_status: 'APPROVED'
        }
      };

      const result = await service.create(createDto);
      expect(result).toEqual(mockNotification);
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of notifications', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockNotification]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single notification', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockNotification);
      expect(repository.findOne).toHaveBeenCalled();
    });
  });

  describe('findByRecipient', () => {
    it('should return notifications for a recipient', async () => {
      const result = await service.findByRecipient(1, 'citizen');
      expect(result).toEqual([mockNotification]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      const result = await service.markAsRead(1);
      expect(result.status).toBe(NotificationStatus.READ);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('markAsArchived', () => {
    it('should mark a notification as archived', async () => {
      const result = await service.markAsArchived(1);
      expect(result.status).toBe(NotificationStatus.ARCHIVED);
      expect(repository.save).toHaveBeenCalled();
    });
  });
}); 