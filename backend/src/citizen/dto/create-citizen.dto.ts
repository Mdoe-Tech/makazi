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

  @IsDate()
  @Type(() => Date)
  date_of_birth: Date;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  nationality: string;

  @IsEmail()
  @IsOptional()
  email?: string;

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
  marital_status: MaritalStatus;

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
  birth_certificate_number: string;
} 
 