import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export abstract class InviteStudioRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  emails: string[];
}
