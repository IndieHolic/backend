import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma.service';
import { CreateGameSaleRequestDto } from 'src/modules/game-sale/dtos/create-game-sale.dto';
import { UpdateGameSaleRequestDto } from 'src/modules/game-sale/dtos/update-game-sale.dto';

@Injectable()
export class GameSaleService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createGameSaleRequestDto: CreateGameSaleRequestDto,
    gameId: number,
  ) {
    const { percent, startAt, endAt } = createGameSaleRequestDto;

    await this.checkOverlap(gameId, startAt, endAt);

    const gameSale = await this.prismaService.gameSales.create({
      data: {
        percent,
        startAt,
        endAt,
        gameId,
      },
    });

    return gameSale;
  }

  async update(
    updateGameSaleRequestDto: UpdateGameSaleRequestDto,
    gameId: number,
  ) {
    const { percent, startAt, endAt } = updateGameSaleRequestDto;
    const gameSale = await this.getGameSaleByGameId(gameId);

    if (!gameSale) {
      throw new BadRequestException('할인 정보가 존재하지 않습니다.');
    }

    await this.prismaService.gameSales.update({
      where: {
        id: gameSale.id,
      },
      data: {
        percent,
        startAt,
        endAt,
      },
    });

    return gameSale;
  }

  async delete(gameId: number) {
    const gameSale = await this.getGameSaleByGameId(gameId);

    if (!gameSale) {
      throw new BadRequestException('할인 정보가 존재하지 않습니다.');
    }

    await this.prismaService.gameSales.delete({
      where: {
        id: gameSale.id,
      },
    });

    return gameSale;
  }

  private async getGameSaleByGameId(gameId: number) {
    const currentDateTime = new Date();
    const gameSale = await this.prismaService.gameSales.findFirst({
      where: {
        gameId,
        startAt: {
          lte: currentDateTime,
        },
        endAt: {
          gte: currentDateTime,
        },
      },
    });
    return gameSale;
  }

  private async checkOverlap(gameId: number, startAt: string, endAt: string) {
    const gameSales = await this.prismaService.gameSales.findMany({
      where: {
        gameId,
        OR: [
          {
            startAt: {
              lte: startAt,
            },
            endAt: {
              gte: startAt,
            },
          },
          {
            startAt: {
              lte: endAt,
            },
            endAt: {
              gte: endAt,
            },
          },
        ],
      },
    });

    if (gameSales.length > 0) {
      throw new BadRequestException(
        '해당 기간에 이미 등록된 할인 정보가 있습니다.',
      );
    }
  }
}
