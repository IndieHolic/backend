import { Boards } from '@prisma/client';
import { IsString } from 'class-validator';

export class UpdateBoardDto implements Partial<Boards> {
  @IsString()
  title?: string;

  @IsString()
  content?: string;

  @IsString()
  tags?: string;
}
