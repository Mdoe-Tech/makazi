import { IsString, IsDate, IsOptional, IsEnum, Matches, Length } from 'class-validator';
import { Gender, MaritalStatus, EmploymentStatus } from '../enums/citizen.enum';

export class CreateCitizenDto {
  @IsString()
  @Length(2, 50)
  first_name: string;

  @IsString()
  @IsOptional()
  @Length(2, 50)
  middle_name?: string;

  @IsString()
  @Length(2, 50)
  last_name: string;

  @IsString()
  @IsOptional()
  @Length(2, 50)
  other_names?: string;

  @IsDate()
  date_of_birth: Date;

  @IsString()
  @Matches(/^[A-Z]{2}\d{6}$/, { message: 'Namba ya cheti cha kuzaliwa inahitaji kuwa na herufi 2 na namba 6' })
  birth_certificate_number: string;

  @IsString()
  @Matches(/^\+255[0-9]{9}$/, { message: 'Namba ya simu inahitaji kuwa na +255 na namba 9' })
  phone_number: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(MaritalStatus)
  marital_status: MaritalStatus;

  @IsString()
  @IsOptional()
  @Length(2, 100)
  occupation?: string;

  @IsString()
  @IsOptional()
  @Length(2, 100)
  employer_name?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[A-Z]{2}\d{6}$/, { message: 'Namba ya dosia inahitaji kuwa na herufi 2 na namba 6' })
  dossier_number?: string;

  @IsEnum(EmploymentStatus)
  @IsOptional()
  employment_status?: EmploymentStatus;

  @IsString()
  @Length(5, 200)
  address: string;

  @IsOptional()
  contact_details?: any;
} 
 