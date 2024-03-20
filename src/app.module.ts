import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrainController } from './controllers/train.controller';
import { TrainService } from './services/train.service';

@Module({
  imports: [],
  controllers: [AppController, TrainController],
  providers: [AppService, TrainService],
})
export class AppModule {}
