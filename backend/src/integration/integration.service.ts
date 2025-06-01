import { Injectable, NotFoundException } from '@nestjs/common';
import { IntegrationConfig, IntegrationType, IntegrationStatus } from './entities/integration-config.entity';
import { LoggingService } from '../logging/logging.service';
import { ConfigService } from '@nestjs/config';
import * as swMessages from '../i18n/sw/sw.json';
import { IntegrationRepository } from './integration.repository';

@Injectable()
export class IntegrationService {
  private readonly nidaApiEnabled: boolean;
  private readonly smsApiEnabled: boolean;
  private readonly emailApiEnabled: boolean;

  constructor(
    private readonly integrationRepository: IntegrationRepository,
    private readonly loggingService: LoggingService,
    private readonly configService: ConfigService
  ) {
    this.nidaApiEnabled = this.configService.get<boolean>('NIDA_API_ENABLED', false);
    this.smsApiEnabled = this.configService.get<boolean>('SMS_API_ENABLED', false);
    this.emailApiEnabled = this.configService.get<boolean>('EMAIL_API_ENABLED', false);
  }

  async createConfig(
    type: IntegrationType,
    name: string,
    config: {
      api_key: string;
      api_secret: string;
      base_url: string;
      endpoints: {
        [key: string]: string;
      };
    },
    userId: number
  ): Promise<IntegrationConfig> {
    const integration = await this.integrationRepository.create({
      integration_name: name,
      config,
      is_active: true,
      metadata: {
        provider: type,
        version: '1.0',
        last_sync: new Date(),
        status: IntegrationStatus.ACTIVE,
        last_modified_by: userId.toString()
      }
    });

    this.loggingService.log(`Integration config created: ${type} - ${name}`);
    return integration;
  }

  async updateConfig(
    id: number,
    config: {
      api_key: string;
      api_secret: string;
      base_url: string;
      endpoints: {
        [key: string]: string;
      };
    },
    userId: number
  ): Promise<IntegrationConfig> {
    const integration = await this.integrationRepository.findOne(id.toString());

    if (!integration) {
      throw new NotFoundException(swMessages.integration.not_found);
    }

    const updatedIntegration = await this.integrationRepository.update(id.toString(), {
      ...integration,
      config,
      metadata: {
        ...integration.metadata,
        last_modified_by: userId.toString(),
        status: IntegrationStatus.INACTIVE
      }
    });

    this.loggingService.log(`Integration config updated: ${integration.metadata.provider} - ${integration.integration_name}`);
    return updatedIntegration;
  }

  async testConnection(id: number): Promise<boolean> {
    const integration = await this.integrationRepository.findOne(id.toString());

    if (!integration) {
      throw new NotFoundException(swMessages.integration.not_found);
    }

    try {
      const updatedIntegration = await this.integrationRepository.update(id.toString(), {
        ...integration,
        metadata: {
          ...integration.metadata,
          status: IntegrationStatus.ACTIVE
        },
        error_log: null
      });
      return true;
    } catch (error) {
      await this.integrationRepository.update(id.toString(), {
        ...integration,
        metadata: {
          ...integration.metadata,
          status: IntegrationStatus.ERROR
        },
        error_log: [{
          timestamp: new Date(),
          error: error.message,
          details: error
        }]
      });
      return false;
    }
  }

  async verifyNidaNumber(nidaNumber: string): Promise<any> {
    // Mock NIDA verification
    const mockNidaData = {
      nida_number: nidaNumber,
      personal_info: {
        first_name: "John",
        middle_name: "Doe",
        last_name: "Smith",
        date_of_birth: "1990-01-01",
        gender: "ME",
        marital_status: "Sijaoa",
        phone_number: "+255123456789"
      },
      parent_info: {
        father: {
          first_name: "Father",
          middle_name: "Middle",
          last_name: "Last",
          birth_country: "Tanzania",
          birth_date: "1960-01-01"
        },
        mother: {
          first_name: "Mother",
          middle_name: "Middle",
          last_name: "Last",
          birth_country: "Tanzania",
          birth_date: "1965-01-01"
        }
      },
      citizenship: {
        type: "Kuzaliwa",
        birth_place: {
          country: "Tanzania",
          region: "Dar es Salaam",
          district: "Ilala",
          ward: "Kariakoo"
        }
      },
      current_residence: {
        house_number: "123",
        region: "Dar es Salaam",
        postal_code: "12345",
        district: "Ilala",
        ward: "Kariakoo",
        street: "Main Street",
        post_box: "12345"
      },
      permanent_residence: {
        house_number: "123",
        region: "Dar es Salaam",
        postal_code: "12345",
        district: "Ilala",
        ward: "Kariakoo",
        street: "Main Street",
        post_box: "12345"
      },
      supporting_documents: {
        passport_number: "P123456",
        voter_id: "V123456",
        health_insurance: "H123456",
        tin_number: "T123456"
      }
    };

    return {
      verified: true,
      data: mockNidaData
    };
  }

  async sendSms(phoneNumber: string, message: string): Promise<any> {
    // Mock SMS sending
    this.loggingService.log(`Mock SMS sent to ${phoneNumber}: ${message}`);
    return { success: true, message: "SMS sent successfully" };
  }

  async sendEmail(to: string, subject: string, body: string): Promise<any> {
    // Mock email sending
    this.loggingService.log(`Mock email sent to ${to}: ${subject}`);
    return { success: true, message: "Email sent successfully" };
  }

  private async getActiveIntegration(type: IntegrationType): Promise<IntegrationConfig> {
    const integrations = await this.integrationRepository.findAll();
    const integration = integrations.find(
      (i) => i.metadata.provider === type && 
      i.metadata.status === IntegrationStatus.ACTIVE && 
      i.is_active
    );

    if (!integration) {
      throw new NotFoundException(swMessages.integration.not_found);
    }

    return integration;
  }
} 