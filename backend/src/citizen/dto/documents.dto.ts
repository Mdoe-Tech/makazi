import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class DocumentsDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9-]+\.(pdf|jpg|jpeg|png)$/, { message: 'Cheti cha kuzaliwa inahitaji kuwa katika muundo sahihi' })
  birth_certificate: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9-]+\.(pdf|jpg|jpeg|png)$/, { message: 'Picha ya pasipoti inahitaji kuwa katika muundo sahihi' })
  passport_photo: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9-]+\.(pdf|jpg|jpeg|png)$/, { message: 'Cheti cha elimu inahitaji kuwa katika muundo sahihi' })
  education_certificate: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9-]+\.(pdf|jpg|jpeg|png)$/, { message: 'Cheti cha kazi inahitaji kuwa katika muundo sahihi' })
  employment_certificate: string;
} 