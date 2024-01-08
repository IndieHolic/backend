import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BoardCreateDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsString()
  thumbnailUrl: string;
}

export class freeBoardCreateDto extends BoardCreateDto {
  @IsNumber()
  parentId: number;
}
