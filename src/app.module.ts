import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './api/tag/tag.module';
import { CardModule } from './api/card/card.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [TagModule, CardModule, LogsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
