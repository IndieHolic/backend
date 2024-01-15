import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Logger,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GamePlayService, GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Users } from '@prisma/client';
import { IdValidationPipe } from 'src/common/pipes/id-validation.pipe';
import { UpdateGameDto } from './dto/update-game.dto';
import { CursorValidationPipe } from 'src/common/pipes/cursor-validation.pipe';
import { OptionalJwtGuard } from 'src/common/guards/optionalJwt.guard';
import { SetTagsDto } from './dto/set-tags.dto';
import { CreateGamePlayHistoryDto } from './dto/create-history.dto';

@Controller('game')
export class GameController {
  private readonly logger = new Logger(GameController.name);
  constructor(private readonly gameService: GameService) {}

  @Post()
  @UseGuards(JwtGuard)
  async createGame(
    @CurrentUser() user: Users,
    @Body(IdValidationPipe)
    createGameInput: CreateGameDto,
  ) {
    try {
      return await this.gameService.createGame(user.id, createGameInput);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async updateGame(
    @CurrentUser() user: Users,
    @Param('id', IdValidationPipe) gameId: number,
    @Body(IdValidationPipe)
    updateGameInput: UpdateGameDto,
  ) {
    try {
      return await this.gameService.updateGame(
        user.id,
        gameId,
        updateGameInput,
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteGame(
    @CurrentUser() user: Users,
    @Param('id', IdValidationPipe) gameId: number,
  ) {
    try {
      return await this.gameService.deleteGame(user.id, gameId);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Get('/category')
  async getGameCategory() {
    try {
      return await this.gameService.getGameCategory();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Get()
  @UseGuards(OptionalJwtGuard)
  async getGamesList(
    @Query('searchText') searchText: string,
    @Query('pageNumber', CursorValidationPipe, new DefaultValuePipe(1))
    pageNumber: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query('collectionId') collectionId: number,
    @Query('categoryNames', ParseArrayPipe)
    categoryNames: string[],
    @CurrentUser() user: Users,
  ) {
    try {
      return await this.gameService.getGamesList(
        searchText,
        pageNumber,
        pageSize,
        collectionId,
        categoryNames,
        user?.id,
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(OptionalJwtGuard)
  async getGameById(
    @CurrentUser() user: Users,
    @Param('id', ParseIntPipe) gameId: number,
  ) {
    try {
      return await this.gameService.getGameById(user?.id, gameId);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Post(':id/tag')
  @UseGuards(JwtGuard)
  async setGameTag(
    @CurrentUser() user: Users,
    @Param('id', ParseIntPipe) gameId: number,
    @Body() input: SetTagsDto,
  ) {
    try {
      return await this.gameService.setGameTags(user?.id, gameId, input);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Post(':id/purchase')
  @UseGuards(JwtGuard)
  async purchaseGame(
    @CurrentUser() user: Users,
    @Param('id', ParseIntPipe) gameId: number,
  ) {
    try {
      return await this.gameService.purchaseGame(user.id, gameId);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}

@Controller('game/play')
export class GamePlayController {
  private readonly logger = new Logger(GamePlayController.name);
  constructor(private readonly gamePlayService: GamePlayService) {}

  @Get(':id')
  @UseGuards(JwtGuard)
  async checkIsPlayable(
    @CurrentUser() user: Users,
    @Param('id', IdValidationPipe) gameId: number,
  ) {
    try {
      return await this.gamePlayService.checkIsPlayable(user.id, gameId);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Post(':id')
  @UseGuards(JwtGuard)
  async createGamePlayHistory(
    @CurrentUser() user: Users,
    @Param('id', IdValidationPipe) gameId: number,
    @Body() createGamePlayHistoryDto: CreateGamePlayHistoryDto,
  ) {
    try {
      return await this.gamePlayService.createGamePlayHistory(
        user.id,
        gameId,
        createGamePlayHistoryDto,
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
