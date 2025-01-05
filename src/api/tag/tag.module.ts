import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { PrismaModule } from 'src/service/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}