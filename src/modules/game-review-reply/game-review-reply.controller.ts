import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Users } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PageDto } from 'src/common/dtos/pagination.dto';
import { checkNumber } from 'src/common/utils/exception.utils';
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';
import {
  CreateGameReviewReplyRequestDto,
  CreateGameReviewReplyResponseDto,
  GetGameReviewReplyListResponseDto,
  GetGameReviewReplyResponseDto,
  UpdateGameReviewReplyRequestDto,
} from 'src/modules/game-review-reply/dtos/game-review-reply.dto';
import { GameReviewReplyService } from 'src/modules/game-review-reply/game-review-reply.service';

@Controller('game')
export class GameReviewReplyController {
  constructor(
    private readonly gameReviewReplyService: GameReviewReplyService,
  ) {}

  @Get('/review/reply/:id')
  async getGameReview(
    @Param('id') id: string,
  ): Promise<GetGameReviewReplyResponseDto> {
    checkNumber(id);
    const gameReview = await this.gameReviewReplyService.find(Number(id));
    return gameReview;
  }

  @Get('/review/:reviewId/reply')
  async getGameReviewList(
    @Param('reviewId') reviewId: string,
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
  ): Promise<GetGameReviewReplyListResponseDto> {
    checkNumber(reviewId);
    checkNumber(pageNumber);
    checkNumber(pageSize);
    const { gameReviewReplies, totalCount } =
      await this.gameReviewReplyService.findByReviewId(
        Number(reviewId),
        Number(pageNumber),
        Number(pageSize),
      );
    return new PageDto(
      Number(pageNumber),
      Number(pageSize),
      totalCount,
      gameReviewReplies,
    );
  }

  @Post('/review/:reviewId/reply')
  @UseGuards(JwtGuard)
  async createGameReview(
    @Param('reviewId') reviewId: number,
    @Body() createGameReviewReplyRequestDto: CreateGameReviewReplyRequestDto,
    @CurrentUser() currentUser: Users,
  ): Promise<CreateGameReviewReplyResponseDto> {
    return await this.gameReviewReplyService.create(
      reviewId,
      currentUser.id,
      createGameReviewReplyRequestDto,
    );
  }

  @Patch('/review/reply/:id')
  @UseGuards(JwtGuard)
  async updateGameReview(
    @Param('id') id: number,
    @Body() updateGameReviewReplyRequestDto: UpdateGameReviewReplyRequestDto,
    @CurrentUser() currentUser: Users,
  ): Promise<UpdateGameReviewReplyRequestDto> {
    return await this.gameReviewReplyService.update(
      id,
      updateGameReviewReplyRequestDto,
      currentUser.id,
    );
  }

  @Delete('/review/reply/:id')
  @UseGuards(JwtGuard)
  async deleteGameReview(
    @Param('id') id: number,
    @CurrentUser() currentUser: Users,
  ) {
    await this.gameReviewReplyService.delete(id, currentUser.id);
  }
}
