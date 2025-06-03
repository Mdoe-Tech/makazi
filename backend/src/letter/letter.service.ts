import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Letter, LetterType, LetterStatus } from './entities/letter.entity';
import { CreateLetterDto, ApproveLetterDto, RejectLetterDto } from './dto/create-letter.dto';
import { LoggingService } from '../logging/logging.service';
import { CitizenService } from '../citizen/citizen.service';
import * as swMessages from '../i18n/sw/sw.json';
import { LetterRepository } from './letter.repository';

@Injectable()
export class LetterService {
  constructor(
    private readonly letterRepository: LetterRepository,
    private readonly citizenService: CitizenService,
    private readonly loggingService: LoggingService
  ) {}

  async create(citizenId: string, createLetterDto: CreateLetterDto): Promise<Letter> {
    this.loggingService.log(`Creating ${createLetterDto.letter_type} letter for citizen ${citizenId}`);

    // Verify citizen exists
    const citizen = await this.citizenService.findOne(citizenId);
    if (!citizen) {
      throw new NotFoundException(swMessages.citizen.not_found);
    }

    // Create letter
    const letter = await this.letterRepository.create({
      letter_type: createLetterDto.letter_type,
      citizen_id: citizenId,
      letter_data: {
        purpose: createLetterDto.purpose,
        destination: createLetterDto.destination,
        duration: createLetterDto.duration,
        additional_info: createLetterDto.additional_info
      },
      status: LetterStatus.PENDING,
      metadata: {
        generated_at: new Date(),
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    });

    return letter;
  }

  async findAll(): Promise<Letter[]> {
    return this.letterRepository.findAll();
  }

  async findOne(id: string): Promise<Letter> {
    const letter = await this.letterRepository.findOne(id);
    if (!letter) {
      throw new NotFoundException(swMessages.letter.not_found);
    }
    return letter;
  }

  async findByCitizenId(citizenId: string): Promise<Letter[]> {
    return this.letterRepository.findByCitizenId(citizenId);
  }

  async findByType(citizenId: string, type: LetterType): Promise<Letter[]> {
    return this.letterRepository.findByType(citizenId, type);
  }

  async approve(id: string, approveLetterDto: ApproveLetterDto, approverId: string): Promise<Letter> {
    const letter = await this.findOne(id);

    if (letter.status !== LetterStatus.PENDING) {
      throw new BadRequestException('Letter is not in pending status');
    }

    const updateData = {
      status: LetterStatus.APPROVED,
      approval_details: {
        approved_by: approverId,
        approved_at: new Date(),
        approval_notes: approveLetterDto.approval_notes
      }
    };

    return this.letterRepository.update(id, updateData);
  }

  async reject(id: string, rejectLetterDto: RejectLetterDto, rejectorId: string): Promise<Letter> {
    const letter = await this.findOne(id);

    if (letter.status !== LetterStatus.PENDING) {
      throw new BadRequestException('Letter is not in pending status');
    }

    const updateData = {
      status: LetterStatus.REJECTED,
      rejection_details: {
        rejected_by: rejectorId,
        rejected_at: new Date(),
        rejection_reason: rejectLetterDto.rejection_reason
      }
    };

    return this.letterRepository.update(id, updateData);
  }

  async generateLetterContent(letter: Letter): Promise<string> {
    const citizen = await this.citizenService.findOne(letter.citizen_id);
    
    // Generate letter content based on type
    if (letter.letter_type === LetterType.INTRODUCTION) {
      return this.generateIntroductionLetter(citizen, letter);
    } else {
      return this.generateSponsorshipLetter(citizen, letter);
    }
  }

  private generateIntroductionLetter(citizen: any, letter: Letter): string {
    return `
      INTRODUCTION LETTER

      To Whom It May Concern,

      This is to certify that ${citizen.first_name} ${citizen.last_name}, 
      holder of NIDA Number ${citizen.nida_number}, is a resident of Tanzania.

      Purpose: ${letter.letter_data.purpose}
      Destination: ${letter.letter_data.destination}
      ${letter.letter_data.duration ? `Duration: ${letter.letter_data.duration}` : ''}

      ${letter.letter_data.additional_info || ''}

      This letter is valid until ${new Date(letter.metadata.expiry_date).toLocaleDateString()}.

      Sincerely,
      [Digital Signature]
    `;
  }

  private generateSponsorshipLetter(citizen: any, letter: Letter): string {
    return `
      SPONSORSHIP LETTER

      To Whom It May Concern,

      This is to certify that ${citizen.first_name} ${citizen.last_name}, 
      holder of NIDA Number ${citizen.nida_number}, is a resident of Tanzania
      and is financially capable of sponsoring the stated purpose.

      Purpose: ${letter.letter_data.purpose}
      Destination: ${letter.letter_data.destination}
      ${letter.letter_data.duration ? `Duration: ${letter.letter_data.duration}` : ''}

      ${letter.letter_data.additional_info || ''}

      This letter is valid until ${new Date(letter.metadata.expiry_date).toLocaleDateString()}.

      Sincerely,
      [Digital Signature]
    `;
  }
} 