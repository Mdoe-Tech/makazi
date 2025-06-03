import { Injectable } from '@nestjs/common';
import { SystemConfigRepository } from './system-config.repository';
import { SystemConfig, ConfigCategory } from './entities/system-config.entity';
import { LoggingService } from '../logging/logging.service';
import * as swMessages from '../i18n/sw/sw.json';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class SystemConfigService {
  constructor(
    private readonly systemConfigRepository: SystemConfigRepository,
    private readonly loggingService: LoggingService
  ) {}

  async findAll(): Promise<SystemConfig[]> {
    return this.systemConfigRepository.findAll();
  }

  async findOne(key: string): Promise<SystemConfig> {
    const config = await this.systemConfigRepository.findOne(key);
    if (!config) {
      throw new NotFoundException(swMessages.config.not_found);
    }
    return config;
  }

  async create(data: Partial<SystemConfig>): Promise<SystemConfig> {
    const config = await this.systemConfigRepository.create(data);
    await this.loggingService.log(`System config created: ${config.key}`);
    return config;
  }

  async update(key: string, data: Partial<SystemConfig>): Promise<SystemConfig> {
    const config = await this.systemConfigRepository.update(key, data);
    await this.loggingService.log(`System config updated: ${key}`);
    return config;
  }

  async findByCategory(category: ConfigCategory): Promise<SystemConfig[]> {
    return this.systemConfigRepository.findByCategory(category);
  }

  async toggleActive(key: string): Promise<SystemConfig> {
    const config = await this.systemConfigRepository.toggleActive(key);
    await this.loggingService.log(`System config toggled: ${key}`);
    return config;
  }

  async remove(key: string): Promise<void> {
    await this.systemConfigRepository.remove(key);
    await this.loggingService.log(`System config deleted: ${key}`);
  }

  private getDefaultDescription(key: string): string {
    const descriptions: Record<string, string> = {
      'biometric.quality_threshold': 'Minimum quality score required for biometric data',
      'document.max_size': 'Maximum file size for document uploads in MB',
      'registration.auto_approve': 'Automatically approve registrations meeting criteria',
      'notification.sms_enabled': 'Enable SMS notifications',
      'notification.email_enabled': 'Enable email notifications',
      'security.password_expiry': 'Password expiry period in days',
      'security.max_login_attempts': 'Maximum failed login attempts before lockout',
      'system.maintenance_mode': 'Enable maintenance mode',
      'system.backup_frequency': 'System backup frequency in hours'
    };
    return descriptions[key] || 'System configuration';
  }

  private getDefaultCategory(key: string): string {
    if (key.startsWith('biometric.')) return 'biometric';
    if (key.startsWith('document.')) return 'document';
    if (key.startsWith('registration.')) return 'registration';
    if (key.startsWith('notification.')) return 'notification';
    if (key.startsWith('security.')) return 'security';
    if (key.startsWith('system.')) return 'system';
    return 'general';
  }
} 