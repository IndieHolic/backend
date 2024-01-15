import { Module } from '@nestjs/common';
import { GameReviewController } from './game-review.controller';
import { GameReviewService } from './game-review.service';

@Module({
  controllers: [GameReviewController],
  providers: [GameReviewService],
})
export class GameReviewModule {}
