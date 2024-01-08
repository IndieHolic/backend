import { Module } from '@nestjs/common';
import { InfoBoardController } from './board.controller';
import { InfoBoardService } from './board.service';

@Module({
  providers: [InfoBoardService],
  controllers: [InfoBoardController],
})
export class BoardModule {}
