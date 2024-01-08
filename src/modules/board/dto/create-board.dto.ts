import { BoardType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BoardCreateDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsString()
  thumbnailUrl: string;

  @IsNotEmpty()
  @IsEnum(BoardType)
  boardType: BoardType;
}

export class freeBoardCreateDto extends BoardCreateDto {
  @IsNumber()
  parentId: number;
}
