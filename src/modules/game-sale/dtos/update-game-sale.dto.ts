import { IsDateString, IsNumber } from 'class-validator';
import { GameSaleDto } from 'src/modules/game-sale/dtos/game-sale.dto';

export abstract class UpdateGameSaleRequestDto {
  @IsNumber()
  percent: number;

  @IsDateString()
  startAt: string;

  @IsDateString()
  endAt: string;
}

export abstract class UpdateGameSaleResponseDto extends GameSaleDto {}
