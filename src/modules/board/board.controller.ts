import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  BoardService,
  FreeBoardService,
  InfoBoardService,
} from './board.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Users } from '@prisma/client';
import { CreateBoardDto, CreateFreeBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { TagParsePipe } from './pipes/tag-parse.pipe';

import { RealIP } from 'nestjs-real-ip';
import { CursorValidationPipe } from 'src/common/pipes/cursor-validation.pipe';
import { SearchValidationPipe } from 'src/common/pipes/search-validation.pipe';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Delete(':boardId')
  @UseGuards(JwtGuard)
  delete(
    @CurrentUser() user: Users,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    return this.boardService.delete(user.id, boardId);
  }

  @Patch(':boardId')
  @UseGuards(JwtGuard)
  update(
    @CurrentUser() user: Users,
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    return this.boardService.update(user.id, boardId, updateBoardDto);
  }

  @Post('/like/:boardId')
  @UseGuards(JwtGuard)
  createLike(
    @CurrentUser() user: Users,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    return this.boardService.createLike(user.id, boardId);
  }

  @Post('/dislike/:boardId')
  @UseGuards(JwtGuard)
  createDislike(
    @CurrentUser() user: Users,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    return this.boardService.createDislike(user.id, boardId);
  }

  @Delete('/like/:boardId')
  @UseGuards(JwtGuard)
  deleteLike(
    @CurrentUser() user: Users,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    return this.boardService.deleteLike(user.id, boardId);
  }

  @Delete('/dislike/:boardId')
  @UseGuards(JwtGuard)
  deleteDislike(
    @CurrentUser() user: Users,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    return this.boardService.deleteDislike(user.id, boardId);
  }
}

@Controller('board/info')
export class InfoBoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly infoBoardService: InfoBoardService,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  create(
    @CurrentUser() user: Users,
    @Body(TagParsePipe) createBoardDto: CreateBoardDto,
  ) {
    console.log(createBoardDto);
    return this.infoBoardService.create(user.id, createBoardDto);
  }

  @Get()
  getInfoBoards(
    @Query('cursor', CursorValidationPipe) cursor: number | null,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('search', SearchValidationPipe) search?: string,
  ) {
    return this.infoBoardService.getInfoBoards(cursor, take, search);
  }

  @Get(':id')
  getInfoBoardByID(
    @Param('id', ParseIntPipe) id: number,
    @RealIP() ip: string,
  ) {
    try {
      this.boardService.addViewHistory(id, ip);
    } catch (error) {
      console.log(error);
    }
    return this.infoBoardService.getInfoBoardByID(id);
  }
}

@Controller('board/free')
export class FreeBoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly freeboardService: FreeBoardService,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  create(
    @CurrentUser() user: Users,
    @Body() createFreeBoardDto: CreateFreeBoardDto,
  ) {
    return this.freeboardService.create(user.id, createFreeBoardDto);
  }

  @Get()
  getFreeBoards(
    @Query('cursor', CursorValidationPipe) cursor: number | null,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('search', SearchValidationPipe) search?: string,
  ) {
    return this.freeboardService.getFreeBoards(cursor, take, search);
  }

  @Get(':id')
  getFreeBoardByID(
    @Param('id', ParseIntPipe) id: number,
    @RealIP() ip: string,
  ) {
    try {
      this.boardService.addViewHistory(id, ip);
    } catch (error) {
      console.log(error);
    }
    return this.freeboardService.getFreeBoardByID(id);
  }
}
