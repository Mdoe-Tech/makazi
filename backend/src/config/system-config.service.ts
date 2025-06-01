import { Injectable, NotFoundException } from '@nestjs/common';
import { SystemConfig } from './entities/system-config.entity';
import { LoggingService } from '../logging/logging.service';
import * as swMessages from '../i18n/sw/sw.json';
import { SystemConfigRepository } from './system-config.repository';

@Injectable()
export class SystemConfigService {
  private configCache: Map<string, any> = new Map();

  constructor(
    private readonly configRepository: SystemConfigRepository,
    private readonly loggingService: LoggingService
  ) {
    this.initializeCache();
  }

  private async initializeCache() {
    const configs = await this.configRepository.findAll();
    configs.forEach(config => {
      this.configCache.set(config.key, config.value);
    });
  }

  async getConfig(key: string): Promise<any> {
    if (this.configCache.has(key)) {
      return this.configCache.get(key);
    }

    const config = await this.configRepository.findByKey(key);

    if (!config || !config.is_active) {
      throw new NotFoundException(swMessages.config.not_found);
    }

    this.configCache.set(key, config.value);
    return config.value;
  }

  async setConfig(key: string, value: any, userId: number): Promise<SystemConfig> {
    let config = await this.configRepository.findByKey(key);

    if (config) {
      config.value = value;
      config.metadata.last_modified_by = userId.toString();
      config = await this.configRepository.update(config.id.toString(), config);
    } else {
      config = await this.configRepository.create({
        key,
        value,
        metadata: {
          category: this.getDefaultCategory(key),
          data_type: typeof value,
          validation_rules: {},
          last_modified_by: userId.toString()
        },
        description: this.getDefaultDescription(key)
      });
    }

    this.configCache.set(key, value);
    this.loggingService.log(`System config updated: ${key}`);
    return config;
  }

  async getAllConfigs(): Promise<SystemConfig[]> {
    return this.configRepository.findAll();
  }

  async getConfigsByCategory(category: string): Promise<SystemConfig[]> {
    const configs = await this.configRepository.findAll();
    return configs.filter(config => config.metadata.category === category);
  }

  async toggleConfig(key: string, userId: number): Promise<SystemConfig> {
    const config = await this.configRepository.findByKey(key);

    if (!config) {
      throw new NotFoundException(swMessages.config.not_found);
    }

    config.is_active = !config.is_active;
    config.metadata.last_modified_by = userId.toString();

    const updatedConfig = await this.configRepository.update(config.id.toString(), config);
    
    if (!updatedConfig.is_active) {
      this.configCache.delete(key);
    } else {
      this.configCache.set(key, updatedConfig.value);
    }

    this.loggingService.log(`System config toggled: ${key}`);
    return updatedConfig;
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