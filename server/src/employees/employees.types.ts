import { IsString, IsEmail, IsUrl } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  position: string;

  @IsString()
  department: string;

  @IsEmail()
  email: string;

  @IsUrl()
  imageUrl: string;
}

export class CreateRelationshipDto {
  @IsString()
  id: string;

  @IsString()
  source: string;

  @IsString()
  target: string;
}