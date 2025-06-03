import { Letter, LetterType } from './entities/letter.entity';

export declare class LetterRepository {
  create(data: Partial<Letter>): Promise<Letter>;
  findAll(): Promise<Letter[]>;
  findOne(id: string): Promise<Letter>;
  findByCitizenId(citizenId: string): Promise<Letter[]>;
  findByType(citizenId: string, type: LetterType): Promise<Letter[]>;
  update(id: string, data: Partial<Letter>): Promise<Letter>;
  delete(id: string): Promise<void>;
} 