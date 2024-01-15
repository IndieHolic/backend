import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAgoraPassDto {
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @IsNotEmpty()
  @IsNumber()
  totalTime: number;
}
