import { Module } from '@nestjs/common';
import { BoardController, InfoBoardController } from './board.controller';
import { BoardService, InfoBoardService } from './board.service';

@Module({
  providers: [BoardService, InfoBoardService],
  controllers: [BoardController, InfoBoardController],
})
export class BoardModule {}
