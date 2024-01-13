import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateGameDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  version: string;

  @IsNotEmpty()
  @IsArray()
  category: string[];

  @IsNotEmpty()
  @IsNumber()
  basePrice: number;
}
