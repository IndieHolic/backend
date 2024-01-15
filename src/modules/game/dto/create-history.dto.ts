import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateGamePlayHistoryDto {
  @IsNotEmpty()
  @IsDate()
  startAt: Date;

  @IsNotEmpty()
  @IsDate()
  endAt: Date;
}
