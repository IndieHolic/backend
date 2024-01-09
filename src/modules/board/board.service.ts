import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma.service';
import { CreateBoardDto, CreateFreeBoardDto } from './dto/create-board.dto';
import { defaultThumbnailUrl } from 'src/common/constants/url.constants';
import { BoardType, LikeStatus } from '@prisma/client';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  constructor(private readonly prismaService: PrismaService) {}

  async delete(userId: number, boardId: number) {
    const targetBoard = await this.prismaService.boards.findFirst({
      where: { id: boardId, writerId: userId },
    });
    if (!targetBoard) {
      throw new ForbiddenException();
    }

    return await this.prismaService.boards.update({
      where: { id: boardId },
      data: {
        updatedAt: targetBoard.updatedAt,
        deletedAt: new Date(),
      },
    });
  }

  async update(boardId: number, userId: number, board: UpdateBoardDto) {
    const targetBoard = await this.prismaService.boards.findFirst({
      where: { id: boardId, writerId: userId, boardType: BoardType.Info },
    });
    if (targetBoard) {
      throw new NotFoundException();
    }

    return await this.prismaService.boards.update({
      where: { id: targetBoard.id },
      data: {
        title: board.title ? board.title : targetBoard.title,
        content: board.content ? board.content : targetBoard.content,
        tags: board.tags ? board.tags : targetBoard.tags,
      },
    });
  }

  async createLike(userId: number, boardId: number) {
    const targetBoard = await this.prismaService.boards.findFirst({
      where: { id: boardId },
      select: {
        id: true,
        likeCount: true,
        BoardLikes: true,
      },
    });
    if (!targetBoard) {
      throw new NotFoundException();
    }

    const existLike = await this.prismaService.boardLikes.findFirst({
      where: { boardId, userId },
    });
    if (existLike) {
      if (existLike.status === LikeStatus.Dislike) {
        throw new ConflictException();
      } else if (existLike.status === LikeStatus.Like) {
        return existLike;
      }
    }

    const result = await this.prismaService.$transaction([
      existLike
        ? this.prismaService.boardLikes.update({
            where: { id: existLike.id },
            data: { status: LikeStatus.Like },
          })
        : this.prismaService.boardLikes.create({
            data: {
              userId,
              boardId,
              status: LikeStatus.Like,
            },
          }),
      this.prismaService.boards.update({
        where: {
          id: targetBoard.id,
        },
        data: {
          likeCount: targetBoard.likeCount + 1,
        },
      }),
    ]);

    return result[0];
  }

  async createDislike(userId: number, boardId: number) {
    const targetBoard = await this.prismaService.boards.findFirst({
      where: { id: boardId },
      select: {
        id: true,
        dislikeCount: true,
        BoardLikes: true,
      },
    });
    if (!targetBoard) {
      throw new NotFoundException();
    }

    const existDislike = await this.prismaService.boardLikes.findFirst({
      where: { boardId, userId },
    });
    if (existDislike) {
      if (existDislike.status === LikeStatus.Like) {
        throw new ConflictException();
      } else if (existDislike.status === LikeStatus.Dislike) {
        return existDislike;
      }
    }

    const result = await this.prismaService.$transaction([
      existDislike
        ? this.prismaService.boardLikes.update({
            where: { id: existDislike.id },
            data: { status: LikeStatus.Dislike },
          })
        : this.prismaService.boardLikes.create({
            data: {
              userId,
              boardId,
              status: LikeStatus.Dislike,
            },
          }),
      this.prismaService.boards.update({
        where: {
          id: targetBoard.id,
        },
        data: {
          dislikeCount: targetBoard.dislikeCount + 1,
        },
      }),
    ]);

    return result[0];
  }

  async deleteLike(userId: number, boardId: number) {
    const targetBoard = await this.prismaService.boards.findFirst({
      where: { id: boardId },
      select: {
        id: true,
        likeCount: true,
        BoardLikes: true,
      },
    });
    if (!targetBoard) {
      throw new NotFoundException();
    }

    const existLike = await this.prismaService.boardLikes.findFirst({
      where: { boardId, userId, status: LikeStatus.Like },
    });
    if (!existLike) {
      throw new NotFoundException();
    }

    const result = await this.prismaService.$transaction([
      this.prismaService.boardLikes.update({
        where: { id: existLike.id },
        data: { status: LikeStatus.None },
      }),
      this.prismaService.boards.update({
        where: { id: targetBoard.id },
        data: { likeCount: targetBoard.likeCount - 1 },
      }),
    ]);

    return result[0];
  }

  async deleteDislike(userId: number, boardId: number) {
    const targetBoard = await this.prismaService.boards.findFirst({
      where: { id: boardId },
      select: {
        id: true,
        dislikeCount: true,
        BoardLikes: true,
      },
    });
    if (!targetBoard) {
      throw new NotFoundException();
    }

    const existDislike = await this.prismaService.boardLikes.findFirst({
      where: { boardId, userId, status: LikeStatus.Like },
    });
    if (!existDislike) {
      throw new NotFoundException();
    }

    const result = await this.prismaService.$transaction([
      this.prismaService.boardLikes.update({
        where: { id: existDislike.id },
        data: { status: LikeStatus.None },
      }),
      this.prismaService.boards.update({
        where: { id: targetBoard.id },
        data: { likeCount: targetBoard.dislikeCount - 1 },
      }),
    ]);

    return result[0];
  }
}

@Injectable()
export class InfoBoardService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(writerId: number, board: CreateBoardDto) {
    if (!board.thumbnailUrl) {
      board.thumbnailUrl = defaultThumbnailUrl;
    }
    console.log(board);

    const newBoard = this.prismaService.boards.create({
      data: {
        writerId,
        title: board.title,
        content: board.content,
        thumbnailUrl: board.thumbnailUrl,
        boardType: BoardType.Info,
        tags: board.tags,
      },
    });

    return newBoard;
  }
}

@Injectable()
export class FreeBoardService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(writerId: number, board: CreateFreeBoardDto) {
    if (!board.thumbnailUrl) {
      board.thumbnailUrl = defaultThumbnailUrl;
    }

    const newBoard = this.prismaService.boards.create({
      data: {
        writerId,
        title: board.title,
        content: board.content,
        thumbnailUrl: board.thumbnailUrl,
        boardType: BoardType.free,
        parentId: board.parentId,
        tags: board.tags,
      },
    });

    return newBoard;
  }
}
