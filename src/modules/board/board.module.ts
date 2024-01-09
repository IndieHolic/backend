import { Module } from '@nestjs/common';
import {
  BoardController,
  FreeBoardController,
  InfoBoardController,
} from './board.controller';
import {
  BoardService,
  FreeBoardService,
  InfoBoardService,
} from './board.service';

@Module({
  providers: [BoardService, InfoBoardService, FreeBoardService],
  controllers: [BoardController, InfoBoardController, FreeBoardController],
})
export class BoardModule {}
