import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { checkNumber } from 'src/common/utils/exception.utils';
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Users } from '@prisma/client';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.uploadService.uploadFile(file);
  }

  @Post('/game')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtGuard)
  async uploadGameFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: Users,
  ) {
    return await this.uploadService.uploadPrivateFile(
      file,
      'GAME',
      currentUser.id,
    );
  }

  @Get('/:id')
  async downloadFile(@Param('id') id: string) {
    checkNumber(id);
    const url = await this.uploadService.getPrivateFileUrl(Number(id));
    return { url };
  }
}
