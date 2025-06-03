import { Injectable, BadRequestException } from '@nestjs/common';
import { RegistrationStatus } from '../enums/registration-status.enum';
import * as swMessages from '../../i18n/sw/sw.json';

@Injectable()
export class RegistrationValidationService {
  private readonly validTransitions = new Map<RegistrationStatus, RegistrationStatus[]>([
    [RegistrationStatus.PENDING, [
      RegistrationStatus.BIOMETRIC_VERIFICATION,
      RegistrationStatus.DOCUMENT_VERIFICATION,
      RegistrationStatus.NIDA_VERIFICATION,
      RegistrationStatus.APPROVED,
      RegistrationStatus.REJECTED
    ]],
    [RegistrationStatus.BIOMETRIC_VERIFICATION, [
      RegistrationStatus.DOCUMENT_VERIFICATION,
      RegistrationStatus.NIDA_VERIFICATION,
      RegistrationStatus.APPROVED,
      RegistrationStatus.REJECTED
    ]],
    [RegistrationStatus.DOCUMENT_VERIFICATION, [
      RegistrationStatus.NIDA_VERIFICATION,
      RegistrationStatus.APPROVED,
      RegistrationStatus.REJECTED
    ]],
    [RegistrationStatus.NIDA_VERIFICATION, [
      RegistrationStatus.APPROVED,
      RegistrationStatus.REJECTED
    ]],
    [RegistrationStatus.APPROVED, []],
    [RegistrationStatus.REJECTED, [RegistrationStatus.PENDING]]
  ]);

  validateStatusTransition(currentStatus: RegistrationStatus, newStatus: RegistrationStatus): void {
    const validNextStatuses = this.validTransitions.get(currentStatus);
    if (!validNextStatuses?.includes(newStatus)) {
      throw new BadRequestException(swMessages.citizen.invalid_status_transition);
    }
  }

  validateApproval(currentStatus: RegistrationStatus): void {
    if (currentStatus === RegistrationStatus.APPROVED || currentStatus === RegistrationStatus.REJECTED) {
      throw new BadRequestException(swMessages.citizen.invalid_approval_status);
    }
  }

  validateRejection(currentStatus: RegistrationStatus, reason: string): void {
    if (!reason) {
      throw new BadRequestException(swMessages.citizen.rejection_reason_required);
    }

    if (currentStatus === RegistrationStatus.APPROVED || currentStatus === RegistrationStatus.REJECTED) {
      throw new BadRequestException(swMessages.citizen.invalid_rejection_status);
    }
  }
} 