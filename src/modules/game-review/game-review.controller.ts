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
  CreateGameReviewRequestDto,
  CreateGameReviewResponseDto,
  GetGameReviewListResponseDto,
  GetGameReviewResponseDto,
  UpdateGameReviewRequestDto,
} from 'src/modules/game-review/dtos/game-review.dto';
import { GameReviewService } from 'src/modules/game-review/game-review.service';

@Controller('game')
export class GameReviewController {
  constructor(private readonly gameReviewService: GameReviewService) {}

  @Get('/review/:id')
  async getGameReview(
    @Param('id') id: string,
  ): Promise<GetGameReviewResponseDto> {
    checkNumber(id);
    const gameReview = await this.gameReviewService.find(Number(id));
    return gameReview;
  }

  @Get('/:gameid/review')
  async getGameReviewList(
    @Param('gameid') gameId: string,
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
  ): Promise<GetGameReviewListResponseDto> {
    checkNumber(gameId);
    checkNumber(pageNumber);
    checkNumber(pageSize);
    const { gameReviews, totalCount } =
      await this.gameReviewService.findByGameId(
        Number(gameId),
        Number(pageNumber),
        Number(pageSize),
      );
    return new PageDto(
      Number(pageNumber),
      Number(pageSize),
      totalCount,
      gameReviews,
    );
  }

  @Post('/:gameId/review')
  @UseGuards(JwtGuard)
  async createGameReview(
    @Param('gameId') gameId: number,
    @Body() createGameReviewRequestDto: CreateGameReviewRequestDto,
    @CurrentUser() currentUser: Users,
  ): Promise<CreateGameReviewResponseDto> {
    return await this.gameReviewService.create(
      gameId,
      currentUser.id,
      createGameReviewRequestDto,
    );
  }

  @Patch('/review/:id')
  @UseGuards(JwtGuard)
  async updateGameReview(
    @Param('id') id: number,
    @Body() updateGameReviewRequestDto: UpdateGameReviewRequestDto,
    @CurrentUser() currentUser: Users,
  ): Promise<UpdateGameReviewRequestDto> {
    return await this.gameReviewService.update(
      id,
      updateGameReviewRequestDto,
      currentUser.id,
    );
  }

  @Delete('/review/:id')
  @UseGuards(JwtGuard)
  async deleteGameReview(
    @Param('id') id: number,
    @CurrentUser() currentUser: Users,
  ) {
    await this.gameReviewService.delete(id, currentUser.id);
  }
}
