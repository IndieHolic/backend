import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Users } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { checkAdmin } from 'src/common/utils/exception.utils';
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';
import {
  CreateGameSaleRequestDto,
  CreateGameSaleResponseDto,
} from 'src/modules/game-sale/dtos/create-game-sale.dto';
import {
  UpdateGameSaleRequestDto,
  UpdateGameSaleResponseDto,
} from 'src/modules/game-sale/dtos/update-game-sale.dto';
import { GameSaleService } from 'src/modules/game-sale/game-sale.service';

@Controller('game/:gameId/sale')
export class GameSaleController {
  constructor(private readonly gameSaleService: GameSaleService) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(
    @Param('gameId') gameId: number,
    @Body() createGameSaleRequestDto: CreateGameSaleRequestDto,
    @CurrentUser() currentUser: Users,
  ): Promise<CreateGameSaleResponseDto> {
    checkAdmin(currentUser); // 임시로 관리자만 접근 가능하도록 설정
    const gameSale = await this.gameSaleService.create(
      createGameSaleRequestDto,
      gameId,
    );
    return gameSale;
  }

  @Patch()
  @UseGuards(JwtGuard)
  async update(
    @Param('gameId') gameId: number,
    @Body() updateGameSaleRequestDto: UpdateGameSaleRequestDto,
    @CurrentUser() currentUser: Users,
  ): Promise<UpdateGameSaleResponseDto> {
    checkAdmin(currentUser); // 임시로 관리자만 접근 가능하도록 설정
    const gameSale = await this.gameSaleService.update(
      updateGameSaleRequestDto,
      gameId,
    );
    return gameSale;
  }

  @Delete()
  @UseGuards(JwtGuard)
  async delete(
    @Param('gameId') gameId: number,
    @CurrentUser() currentUser: Users,
  ) {
    checkAdmin(currentUser); // 임시로 관리자만 접근 가능하도록 설정
    await this.gameSaleService.delete(gameId);
  }
}
