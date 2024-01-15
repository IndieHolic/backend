import { BadRequestException, Injectable } from '@nestjs/common';
import { getPageOffset } from 'src/common/utils/pagination.util';
import { PrismaService } from 'src/config/database/prisma.service';
import { SELECT_GAME_REVIEW_REPLY } from 'src/modules/game-review-reply/constants/select.constant';
import {
  CreateGameReviewReplyRequestDto,
  UpdateGameReviewReplyRequestDto,
} from 'src/modules/game-review-reply/dtos/game-review-reply.dto';

@Injectable()
export class GameReviewReplyService {
  constructor(private readonly prismaService: PrismaService) {}

  async find(id: number) {
    const gameReviewReply =
      await this.prismaService.gameReviewReplies.findUnique({
        where: { id },
        select: SELECT_GAME_REVIEW_REPLY,
      });

    if (!gameReviewReply) {
      throw new BadRequestException('존재하지 않는 답글입니다.');
    }

    return gameReviewReply;
  }

  async findByReviewId(reviewId: number, pageNumber: number, pageSize: number) {
    const gameReviewReplies =
      await this.prismaService.gameReviewReplies.findMany({
        where: {
          reviewId,
        },
        select: SELECT_GAME_REVIEW_REPLY,
        skip: getPageOffset(pageNumber, pageSize),
        take: pageSize,
      });

    const totalCount = await this.prismaService.gameReviewReplies.count({
      where: {
        reviewId,
      },
    });

    return {
      totalCount,
      gameReviewReplies,
    };
  }

  async create(
    reviewId: number,
    userId: number,
    createGameReviewReplyRequestDto: CreateGameReviewReplyRequestDto,
  ) {
    const gameReviewReply = await this.prismaService.gameReviewReplies.create({
      data: {
        ...createGameReviewReplyRequestDto,
        reviewId,
        userId,
      },
      select: SELECT_GAME_REVIEW_REPLY,
    });

    return gameReviewReply;
  }

  async update(
    id: number,
    updateGameReviewReplyRequestDto: UpdateGameReviewReplyRequestDto,
    userId: number,
  ) {
    const gameReviewReply = await this.prismaService.gameReviewReplies.update({
      where: {
        id,
      },
      data: {
        ...updateGameReviewReplyRequestDto,
      },
      select: SELECT_GAME_REVIEW_REPLY,
    });

    if (!gameReviewReply) {
      throw new BadRequestException('존재하지 않는 답글입니다.');
    }

    if (gameReviewReply.user.id !== userId) {
      throw new BadRequestException('본인의 답글만 수정할 수 있습니다.');
    }

    return gameReviewReply;
  }

  async delete(id: number, userId: number) {
    const gameReviewReply =
      await this.prismaService.gameReviewReplies.findUnique({
        where: {
          id,
        },
        select: SELECT_GAME_REVIEW_REPLY,
      });

    if (!gameReviewReply) {
      throw new BadRequestException('존재하지 않는 답글입니다.');
    }

    if (gameReviewReply.user.id !== userId) {
      throw new BadRequestException('본인의 답글만 삭제할 수 있습니다.');
    }

    await this.prismaService.gameReviewReplies.delete({
      where: {
        id,
      },
    });

    return gameReviewReply;
  }
}
