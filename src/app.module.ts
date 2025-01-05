import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './api/tag/tag.module';
import { CardModule } from './api/card/card.module';

@Module({
  imports: [TagModule, CardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
