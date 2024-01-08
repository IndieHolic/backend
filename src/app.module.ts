import { Module } from '@nestjs/common';
import { PrismaModule } from './config/database/prisma.module';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
})
export class AppModule {}
