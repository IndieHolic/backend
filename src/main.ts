import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from 'src/config/database/prisma.service';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config();
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHook(app);

  await app.listen(4000);
}

bootstrap();
