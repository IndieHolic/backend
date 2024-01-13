import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  studioId: number;

  @IsNotEmpty()
  @IsString()
  version: string;

  @IsNotEmpty()
  @IsNumber()
  fileId: number;

  @IsNotEmpty()
  @IsArray()
  category: string[];

  @IsNotEmpty()
  @IsNumber()
  basePrice: number;
}
