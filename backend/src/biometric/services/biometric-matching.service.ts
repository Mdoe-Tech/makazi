import { Injectable } from '@nestjs/common';
import { Biometric } from '../entities/biometric.entity';
import { LoggingService } from '../../logging/logging.service';
import * as swMessages from '../../i18n/sw/sw.json';
import { BiometricRepository } from '../biometric.repository';

@Injectable()
export class BiometricMatchingService {
  constructor(
    private readonly biometricRepository: BiometricRepository,
    private readonly loggingService: LoggingService
  ) {}

  async matchFingerprint(fingerprintData: string, threshold: number = 0.8): Promise<Biometric[]> {
    this.loggingService.log('Performing fingerprint matching');
    
    const allBiometrics = await this.biometricRepository.findAll();
    
    const matches = allBiometrics.filter(biometric => {
      const similarity = this.calculateFingerprintSimilarity(fingerprintData, biometric.fingerprint_data);
      return similarity >= threshold;
    });

    this.loggingService.log(`Found ${matches.length} fingerprint matches`);
    return matches;
  }

  private calculateFingerprintSimilarity(data1: string, data2: string): number {
    // This is a placeholder for actual fingerprint matching algorithm
    // In a real implementation, you would:
    // 1. Decode the base64 data
    // 2. Extract minutiae points
    // 3. Compare the points using a matching algorithm
    // 4. Return a similarity score between 0 and 1
    
    return Math.random();
  }
} 