import { Module } from '@nestjs/common';
import { GameReviewReplyController } from './game-review-reply.controller';
import { GameReviewReplyService } from './game-review-reply.service';

@Module({
  controllers: [GameReviewReplyController],
  providers: [GameReviewReplyService],
})
export class GameReviewReplyModule {}
