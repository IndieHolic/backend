import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";
import { BoardCreateDto } from "./dto/create-board.dto";
import { defaultThumbnailUrl } from "src/common/constants/url.constants";

@Injectable()
export class BoardService {
  constructor(private readonly prismaService: PrismaService) {}

  async delete(userId: number, boardId: number) {
    const targetBoard = this.prismaService.boards.findFirst({
      where: { id: boardId, writerId: userId },
    });
    if (targetBoard) {
      throw new ForbiddenException();
    }

    return this.prismaService.boards.delete({ where: { id: boardId } });
  }

  async createLike(userId: number, boardId: number) {
    const targetBoard = this.prismaService.boards.findFirst({
      where: { id: boardId },
      select: {
        id: true,
        likeCount: true,
        dislikeCount: true,
        BoardLikes: true,
      },
    });
    if (targetBoard) {
      throw new NotFoundException();
    }
  }
}

@Injectable()
export class InfoBoardService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(writerId: number, board: BoardCreateDto) {
    if (board.thumbnailUrl) {
      board.thumbnailUrl = defaultThumbnailUrl;
    }

    const newBoard = this.prismaService.boards.create({
      data: {
        writerId,
        ...board,
      },
    });

    return newBoard;
  }
}
