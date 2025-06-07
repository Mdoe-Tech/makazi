import { IsString, IsEmail, IsOptional, IsDate, IsEnum, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Gender, MaritalStatus, EmploymentStatus } from '../enums/citizen.enum';

class AddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  region: string;

  @IsString()
  postal_code: string;
}

export class CreateCitizenDto {
  @IsString()
  nida_number: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  @IsOptional()
  middle_name?: string;

  @Type(() => Date)
  @IsDate()
  date_of_birth: Date;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  @IsOptional()
  nationality?: string;

  @IsEmail()
  @IsOptional()
  @Type(() => String)
  email?: string | null;

  @IsString()
  phone_number: string;

  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsString()
  @IsOptional()
  other_names?: string;

  @IsEnum(MaritalStatus)
  @IsOptional()
  marital_status?: MaritalStatus;

  @IsString()
  @IsOptional()
  occupation?: string;

  @IsString()
  @IsOptional()
  employer_name?: string;

  @IsEnum(EmploymentStatus)
  @IsOptional()
  employment_status?: EmploymentStatus;

  @IsString()
  @IsOptional()
  birth_certificate_number?: string;

  @IsString()
  @IsOptional()
  father_name?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  father_date_of_birth?: Date;

  @IsString()
  @IsOptional()
  mother_name?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  mother_date_of_birth?: Date;

  @IsString()
  @IsOptional()
  dossier_number?: string;
} 
 