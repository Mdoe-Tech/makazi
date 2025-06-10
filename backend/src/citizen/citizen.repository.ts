import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistrationStatus } from './enums/registration-status.enum';
import { Citizen } from './entities/citizen.entity';

@Injectable()
export class CitizenRepository {
  constructor(
    @InjectRepository(Citizen)
    private repository: Repository<Citizen>
  ) {}

  async findOne(id: string): Promise<Citizen | null> {
    console.log('Repository findOne - ID:', id); // Debug log
    try {
      const citizen = await this.repository.createQueryBuilder('citizen')
        .where('citizen.id = :id', { id })
        .getOne();
      console.log('Repository findOne - Result:', citizen); // Debug log
      return citizen;
    } catch (error) {
      console.error('Repository findOne - Error:', error); // Debug log
      throw error;
    }
  }

  async findById(id: string): Promise<Citizen | null> {
    console.log('Repository findById - ID:', id); // Debug log
    try {
      const citizen = await this.repository.findOne({ where: { id } });
      console.log('Repository findById - Result:', citizen); // Debug log
      return citizen;
    } catch (error) {
      console.error('Repository findById - Error:', error); // Debug log
      throw error;
    }
  }

  async findByNidaNumber(nidaNumber: string): Promise<Citizen | null> {
    console.log('Repository findByNidaNumber - NIDA:', nidaNumber); // Debug log
    try {
      const citizen = await this.repository.findOne({ where: { nida_number: nidaNumber } });
      console.log('Repository findByNidaNumber - Result:', citizen); // Debug log
      return citizen;
    } catch (error) {
      console.error('Repository findByNidaNumber - Error:', error); // Debug log
      throw error;
    }
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

  create(data: Partial<Citizen>): Citizen {
    const citizen = new Citizen();
    Object.assign(citizen, data);
    return citizen;
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

  async remove(citizen: Citizen): Promise<Citizen> {
    return this.repository.remove(citizen);
  }

  async save(citizen: Citizen): Promise<Citizen> {
    return this.repository.save(citizen);
  }

  async findAll(): Promise<Citizen[]> {
    return this.repository.find();
  }
} 