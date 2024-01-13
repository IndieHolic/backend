import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { getPageOffset } from 'src/common/utils/pagination.util';

@Injectable()
export class GameService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly gameSelectOption = {
    id: true,
    title: true,
    studio: {
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    },
    version: {
      select: {
        version: true,
        fileId: true,
        createdAt: true,
        updatedAt: true,
      },
    },
    basePrice: true,
    createdAt: true,
    updatedAt: true,
    GameCategories: true,
  };

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
              fileId: game.fileId,
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
      where: {
        id: gameId,
        studio: {
          UserStudioLinks: { some: { userId } },
        },
      },
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

    try {
      return await this.prismaService.games.update({
        where: { id: gameId },
        data: {
          title: game.title,
          basePrice: game.basePrice,
          GameCategories: {
            disconnect: targetGame.GameCategories,
            connect: game.category?.map((category) => {
              return { name: category };
            }),
          },
          version: {
            create: {
              version: game.version,
              fileId: game.fileId,
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
    } catch (error) {
      throw error;
    }
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
    return await this.prismaService.gameCategories.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async getGamesList(
    searchText: string,
    pageNumber: number,
    pageSize: number,
    collectionId: number,
    categoryNames: string[],
    userId: number,
  ) {
    const where = {
      OR: [
        { title: { contains: searchText } },
        { description: { contains: searchText } },
      ],
      GameCollections: collectionId
        ? {
            some: { id: collectionId },
          }
        : undefined,
      GameCategories: {
        some: { name: { in: categoryNames } },
      },
    };

    const games = await this.prismaService.games.findMany({
      where,
      select: {
        ...this.gameSelectOption,
        GamePurchases: {
          where: {
            userId,
          },
        },
      },
      skip: getPageOffset(pageNumber, pageSize),
      take: pageSize,
    });

    const totalCount = await this.prismaService.games.count({
      where,
    });

    return {
      content: games.map(({ GamePurchases, ...game }) => ({
        ...game,
        purchased: GamePurchases.length != 0,
      })),
      pageNumber,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }

  async getGameById(userId: number, gameId: number) {
    try {
      const { GamePurchases, ...game } =
        await this.prismaService.games.findUniqueOrThrow({
          where: { id: gameId },
          select: {
            ...this.gameSelectOption,
            GamePurchases: {
              where: {
                userId,
              },
            },
          },
        });
      return {
        ...game,
        purchased: GamePurchases.length != 0,
      };
    } catch (error) {
      throw error;
    }
  }
}
