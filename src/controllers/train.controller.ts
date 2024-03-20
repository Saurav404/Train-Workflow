import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ResponseDto } from 'src/dto/response.dto';
import { Coach } from 'src/models.ts/coach.model';
import { Pantry } from 'src/models.ts/pantry.model';
import { TrainService } from 'src/services/train.service';

@Controller('train')
export class TrainController {
  constructor(private readonly trainService: TrainService) {}

  @Post('start')
  startTrain(): ResponseDto {
    const data: ResponseDto = this.trainService.startTrain();
    return data;
  }

  @Post('stop')
  stopTrain(): ResponseDto {
    const data: ResponseDto = this.trainService.stopTrain();
    return data;
  }

  @Post('connect-engine')
  connectEngine(@Body() engine: Coach): ResponseDto {
    const data: ResponseDto = this.trainService.connectEngine(engine?.startRole, engine?.presentRole, engine?.nextRole);
    return data;
  }

  @Post('connect-coach')
  connectCoach(@Body() coach: Coach): ResponseDto {
    const data: ResponseDto = this.trainService.connectCoach(coach?.startRole, coach?.presentRole, coach?.nextRole, coach?.actionBy);
    return data;
  }

  @Post('connect-pantry')
  connectPantry(@Body() pantry: Pantry): ResponseDto {
    const data: ResponseDto = this.trainService.connectPantry(pantry?.startRole, pantry?.presentRole, pantry?.nextRole, pantry?.type, pantry?.actionBy);
    return data;
  }

  @Delete('disconnect-block')
  disconnectLastBlock(): ResponseDto {
    const data: ResponseDto = this.trainService.disconnectLastBlock();
    return data;
  }

  @Get('block-actions/:id')
  actionsByBlock(@Param() param: any): ResponseDto {
    const data: ResponseDto = this.trainService.actionsByBlock(param.id);
    return data;
  }

  @Get('workflow')
  printWorkflow(): ResponseDto {
    const data: ResponseDto = this.trainService.printWorkFlow();
    return data;
  }
}
