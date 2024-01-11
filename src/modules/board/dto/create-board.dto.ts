import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBoardDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsString()
  thumbnailUrl: string;

  @IsString()
  tags: string;
}

export class CreateFreeBoardDto extends CreateBoardDto {
  @IsNumber()
  parentId: number;
}
