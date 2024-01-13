import { Module } from '@nestjs/common';
import { GameSaleController } from './game-sale.controller';
import { GameSaleService } from './game-sale.service';

@Module({
  controllers: [GameSaleController],
  providers: [GameSaleService],
})
export class GameSaleModule {}
