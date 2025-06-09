import { Injectable } from '@nestjs/common';
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent } from 'typeorm';
import { LoggingService } from '../../logging/logging.service';

@Injectable()
@EventSubscriber()
export class QueryLoggerSubscriber implements EntitySubscriberInterface {
  private loggingService?: LoggingService;

  constructor(loggingService?: LoggingService) {
    this.loggingService = loggingService;
  }

  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, context: string, metadata?: any) {
    if (this.loggingService && typeof this.loggingService[level] === 'function') {
      this.loggingService[level](message, context, metadata);
    }
  }

  beforeInsert(event: InsertEvent<any>) {
    this.log('debug',
      `Inserting into ${event.metadata.tableName}`,
      'Database',
      {
        entity: event.metadata.name,
        data: this.sanitizeData(event.entity),
      }
    );
  }

  afterInsert(event: InsertEvent<any>) {
    this.log('debug',
      `Inserted into ${event.metadata.tableName}`,
      'Database',
      {
        entity: event.metadata.name,
        id: event.entity.id,
      }
    );
  }

  beforeUpdate(event: UpdateEvent<any>) {
    this.log('debug',
      `Updating ${event.metadata.tableName}`,
      'Database',
      {
        entity: event.metadata.name,
        id: event.entity.id,
        changes: this.sanitizeData(event.entity),
      }
    );
  }

  afterUpdate(event: UpdateEvent<any>) {
    this.log('debug',
      `Updated ${event.metadata.tableName}`,
      'Database',
      {
        entity: event.metadata.name,
        id: event.entity.id,
      }
    );
  }

  beforeRemove(event: RemoveEvent<any>) {
    if (!event.entity) {
      this.log('warn',
        `Attempting to remove from ${event.metadata.tableName} without entity`,
        'Database',
        {
          entity: event.metadata.name,
        }
      );
      return;
    }

    this.log('debug',
      `Removing from ${event.metadata.tableName}`,
      'Database',
      {
        entity: event.metadata.name,
        id: event.entity.id,
      }
    );
  }

  afterRemove(event: RemoveEvent<any>) {
    if (!event.entity) {
      this.log('warn',
        `Removed from ${event.metadata.tableName} without entity`,
        'Database',
        {
          entity: event.metadata.name,
        }
      );
      return;
    }

    this.log('debug',
      `Removed from ${event.metadata.tableName}`,
      'Database',
      {
        entity: event.metadata.name,
        id: event.entity.id,
      }
    );
  }

  private sanitizeData(data: any): any {
    if (!data) return data;
    
    const sanitized = { ...data };
    const sensitiveFields = ['password', 'token', 'secret', 'authorization'];
    
    sensitiveFields.forEach(field => {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }
} 