import { IsArray, IsNotEmpty } from 'class-validator';

export class SetTagsDto {
  @IsNotEmpty()
  @IsArray()
  tags: string[];
}
