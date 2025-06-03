import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistrationStatus } from './enums/registration-status.enum';
import { Citizen } from './entities/citizen.entity';

@Injectable()
export class CitizenRepository {
  constructor(
    @InjectRepository(Citizen)
    private readonly repository: Repository<Citizen>
  ) {}

  async findAll(): Promise<Citizen[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<Citizen | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByNidaNumber(nidaNumber: string): Promise<Citizen | null> {
    return this.repository.findOne({ where: { nida_number: nidaNumber } });
  }

  async findByBirthCertificateNumber(birthCertificateNumber: string): Promise<Citizen | null> {
    return this.repository.findOne({ where: { birth_certificate_number: birthCertificateNumber } });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Citizen | null> {
    return this.repository.findOne({ where: { phone_number: phoneNumber } });
  }

  async findByRegistrationStatus(status: RegistrationStatus): Promise<Citizen[]> {
    return this.repository.find({ where: { registration_status: status } });
  }

  async create(data: Partial<Citizen>): Promise<Citizen> {
    const citizen = this.repository.create(data);
    return this.repository.save(citizen);
  }

  async update(id: string, data: Partial<Citizen>): Promise<Citizen> {
    await this.repository.update(id, data);
    return this.findOne(id);
  }

  async updateRegistrationStatus(id: string, status: RegistrationStatus, metadata: any = {}): Promise<Citizen> {
    const citizen = await this.findOne(id);
    if (!citizen) {
      throw new Error('Citizen not found');
    }

    const statusHistory = citizen.metadata?.status_history || [];
    statusHistory.push({
      status,
      timestamp: new Date(),
      metadata
    });

    citizen.registration_status = status;
    citizen.metadata = {
      ...citizen.metadata,
      status_history: statusHistory
    };

    return this.repository.save(citizen);
  }

  async updateBiometricData(id: string, biometricData: any): Promise<Citizen> {
    const citizen = await this.findOne(id);
    if (!citizen) {
      throw new Error('Citizen not found');
    }

    citizen.biometric_data = biometricData;
    return this.repository.save(citizen);
  }

  async updateDocuments(id: string, documents: any): Promise<Citizen> {
    const citizen = await this.findOne(id);
    if (!citizen) {
      throw new Error('Citizen not found');
    }

    citizen.documents = documents;
    return this.repository.save(citizen);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
} 