import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { title } from 'process';
import { getPageOffset } from 'src/common/utils/pagination.util';

@Injectable()
export class GameService {
  constructor(private readonly prismaService: PrismaService) {}

  async createGame(userId: number, game: CreateGameDto) {
    const studio = await this.prismaService.studios.findUnique({
      where: { id: game.studioId },
    });
    if (!studio) {
      throw new NotFoundException('studio is notfound');
    }

    try {
      const newGame = await this.prismaService.games.create({
        data: {
          title: game.title,
          description: game.description,
          studioId: game.studioId,
          basePrice: game.basePrice,
          GameCategories: {
            connect: game.category.map((category) => ({
              name: category,
            })),
          },
          version: {
            create: {
              version: game.version,
            },
          },
        },
      });
      return newGame;
    } catch (error) {
      throw error;
    }
  }

  async updateGame(userId: number, gameId: number, game: UpdateGameDto) {
    const targetGame = await this.prismaService.games.findUnique({
      where: { id: gameId },
      select: {
        title: true,
        version: { select: { id: true } },
        studio: { select: { UserStudioLinks: true } },
        GameCategories: { select: { name: true } },
      },
    });
    if (!targetGame) {
      throw new NotFoundException();
    }

    if (
      !targetGame.studio.UserStudioLinks.map((link) => link.userId).includes(
        userId,
      )
    ) {
      throw new ForbiddenException();
    }

    game.category = game.category ? game.category : [];

    return await this.prismaService.games.update({
      where: { id: gameId },
      data: {
        title: title,
        basePrice: game.basePrice,
        GameCategories: {
          disconnect: targetGame.GameCategories,
          connect: game.category.map((category) => {
            return { name: category };
          }),
        },
        version: {
          create: {
            version: game.version,
          },
        },
      },
      select: {
        id: true,
        title: true,
        studioId: true,
        basePrice: true,
        GameCategories: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteGame(userId: number, gameId: number) {
    const targetGame = await this.prismaService.games.findUnique({
      where: { id: gameId },
      select: {
        title: true,
        version: { select: { id: true } },
        studio: { select: { UserStudioLinks: true } },
        GameCategories: { select: { name: true } },
      },
    });
    if (!targetGame) {
      throw new NotFoundException();
    }

    console.log(
      targetGame.studio.UserStudioLinks.map((link) => link.userId).includes(
        userId,
      ),
    );
    if (
      !targetGame.studio.UserStudioLinks.map((link) => link.userId).includes(
        userId,
      )
    ) {
      throw new ForbiddenException();
    }

    await this.prismaService.games.delete({ where: { id: gameId } });
    return { message: 'success' };
  }

  async getGameCategory() {
    return await this.prismaService.gameCategories.findMany();
  }

  async getGames(
    searchText: string,
    pageNumber: number,
    pageSize: number,
    collectionId: number,
    categoryNames: string[],
  ) {
    console.log(searchText, collectionId);
    const games = await this.prismaService.games.findMany({
      where: {
        OR: [
          { title: { contains: searchText } },
          { description: { contains: searchText } },
        ],
        // GameCollectionLinks: { some: { collectionId } },
        GameCategories: {
          some: {
            name: { in: categoryNames },
          },
        },
      },
      skip: getPageOffset(pageNumber, pageSize),
      take: pageSize,
    });
    console.log(games);

    const totalCount = await this.prismaService.games.count({
      where: {
        OR: [
          { title: { contains: searchText } },
          { description: { contains: searchText } },
        ],
        GameCollectionLinks: { some: { collectionId } },
        GameCategories: {
          some: {
            name: { in: categoryNames },
          },
        },
      },
    });

    return {
      content: games,
      pageNumber,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }

  async getGame(gameId: number) {
    try {
      return await this.prismaService.games.findUniqueOrThrow({
        where: { id: gameId },
      });
    } catch (error) {
      throw error;
    }
  }
}
