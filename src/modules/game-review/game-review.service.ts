import { BadRequestException, Injectable } from '@nestjs/common';
import { getPageOffset } from 'src/common/utils/pagination.util';
import { PrismaService } from 'src/config/database/prisma.service';
import { SELECT_GAME_REVIEW } from 'src/modules/game-review/constants/select.constant';
import {
  CreateGameReviewRequestDto,
  UpdateGameReviewRequestDto,
} from 'src/modules/game-review/dtos/game-review.dto';

@Injectable()
export class GameReviewService {
  constructor(private readonly prismaService: PrismaService) {}

  async find(id: number) {
    const gameReview = await this.prismaService.gameReviews.findUnique({
      where: { id },
      select: SELECT_GAME_REVIEW,
    });

    if (!gameReview) {
      throw new BadRequestException('존재하지 않는 리뷰입니다.');
    }

    return gameReview;
  }

  async findByGameId(gameId: number, pageNumber: number, pageSize: number) {
    const gameReviews = await this.prismaService.gameReviews.findMany({
      where: {
        gameId,
      },
      select: SELECT_GAME_REVIEW,
      skip: getPageOffset(pageNumber, pageSize),
      take: pageSize,
    });

    const totalCount = await this.prismaService.gameReviews.count({
      where: {
        gameId,
      },
    });

    return {
      totalCount,
      gameReviews,
    };
  }

  async create(
    gameId: number,
    userId: number,
    createGameReviewRequestDto: CreateGameReviewRequestDto,
  ) {
    const gameReview = await this.prismaService.gameReviews.create({
      data: {
        ...createGameReviewRequestDto,
        gameId,
        userId,
      },
      select: SELECT_GAME_REVIEW,
    });

    return gameReview;
  }

  async update(
    id: number,
    updateGameReviewRequestDto: UpdateGameReviewRequestDto,
    userId: number,
  ) {
    const gameReview = await this.prismaService.gameReviews.update({
      where: {
        id,
      },
      data: {
        ...updateGameReviewRequestDto,
      },
      select: SELECT_GAME_REVIEW,
    });

    if (!gameReview) {
      throw new BadRequestException('존재하지 않는 리뷰입니다.');
    }

    if (gameReview.user.id !== userId) {
      throw new BadRequestException('본인의 리뷰만 수정할 수 있습니다.');
    }

    return gameReview;
  }

  async delete(id: number, userId: number) {
    const gameReview = await this.prismaService.gameReviews.findUnique({
      where: {
        id,
      },
      select: SELECT_GAME_REVIEW,
    });

    if (!gameReview) {
      throw new BadRequestException('존재하지 않는 리뷰입니다.');
    }

    if (gameReview.user.id !== userId) {
      throw new BadRequestException('본인의 리뷰만 삭제할 수 있습니다.');
    }

    await this.prismaService.gameReviews.delete({
      where: {
        id,
      },
    });

    return gameReview;
  }
}
