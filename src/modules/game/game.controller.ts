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
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Users } from '@prisma/client';
import { IdValidationPipe } from 'src/common/pipes/id-validation.pipe';
import { UpdateGameDto } from './dto/update-game.dto';
import { CursorValidationPipe } from 'src/common/pipes/cursor-validation.pipe';

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
  async getGames(
    @Query('searchText') searchText: string,
    @Query('pageNumber', CursorValidationPipe, new DefaultValuePipe(1))
    pageNumber: number,
    @Query('pageSize', new DefaultValuePipe(10)) pageSize: number,
    @Query('collectionId', IdValidationPipe) collectionId: number,
    @Query('categoryNames', ParseArrayPipe)
    categoryNames: string[],
  ) {
    try {
      return await this.gameService.getGames(
        searchText,
        pageNumber,
        pageSize,
        collectionId,
        categoryNames,
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Get(':id')
  async getGameById(@Param('id', ParseIntPipe) gameId: number) {
    try {
      return;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
