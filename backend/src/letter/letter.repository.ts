import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Letter, LetterType } from './entities/letter.entity';

@Injectable()
export class LetterRepository {
  constructor(
    @InjectRepository(Letter)
    private readonly repository: Repository<Letter>
  ) {}

  async create(data: Partial<Letter>): Promise<Letter> {
    const letter = this.repository.create(data);
    return this.repository.save(letter);
  }

  async findAll(): Promise<Letter[]> {
    return this.repository.find({
      order: {
        created_at: 'DESC'
      }
    });
  }

  async findOne(id: string): Promise<Letter> {
    return this.repository.findOne({ where: { id } });
  }

  async findByCitizenId(citizenId: string): Promise<Letter[]> {
    return this.repository.find({
      where: { citizen_id: citizenId },
      order: {
        created_at: 'DESC'
      }
    });
  }

  async findByType(citizenId: string, type: LetterType): Promise<Letter[]> {
    return this.repository.find({
      where: {
        citizen_id: citizenId,
        letter_type: type
      },
      order: {
        created_at: 'DESC'
      }
    });
  }

  async update(id: string, data: Partial<Letter>): Promise<Letter> {
    await this.repository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
} 