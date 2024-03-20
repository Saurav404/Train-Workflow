import { BadRequestException, Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/dto/response.dto';
import { Coach } from 'src/models.ts/coach.model';
import { Pantry, PantryType, isValidPantryType } from 'src/models.ts/pantry.model';

@Injectable()
export class TrainService {
  private isRunning: boolean = false;
  private trainWorkFlow: any[] = [];

  startTrain(): ResponseDto {
    //check if there is engine present
    if (this.trainWorkFlow.length === 0) {
      throw new BadRequestException('There is no engine');
    }

    //check if train is already running
    if (this.isRunning) {
      return {
        message: 'Train is already running',
        status: 'SUCCESS',
      };
    }

    this.isRunning = true;

    return {
      message: 'Train Started',
      status: 'SUCCESS',
    };
  }

  stopTrain(): ResponseDto {
    //check if there is engine present
    if (this.trainWorkFlow.length === 0) {
      throw new BadRequestException('There is no engine');
    }

    //check if train is already stopped
    if (!this.isRunning) {
      return {
        message: 'Train is already stopped',
        status: 'SUCCESS',
      };
    }

    this.isRunning = false;
    
    return {
      message: 'Train is stopped',
      status: 'SUCCESS',
    };
  }

  connectEngine(startRole: string[], presentRole: string, nextRole: string[]): ResponseDto {
    //check if train engine is already connected
    if (this.trainWorkFlow.length >= 1) {
      throw new BadRequestException('Train Engine Already Connected');
    }

    //check there is no block before the train engine
    if (startRole[0].toLowerCase() !== 'none') {
      throw new BadRequestException('There should not be any block before the engine');
    }

    //check if next role is not an empty arr
    if (nextRole.length < 1 || nextRole[0].toLowerCase() === 'none') {
      throw new BadRequestException('Next role/block on an engine cannot be empty');
    }

    this.trainWorkFlow.push({
      startRole,
      presentRole,
      nextRole,
    });

    return {
      data: this.trainWorkFlow,
      message: 'Engine added to the Train workflow',
      status: 'SUCCESS',
    };
  }

  connectCoach(startRole: string[], presentRole: string, nextRole: string[], actionBy?: string[]): ResponseDto {
    //check if the workflow is empty, then give error
    if (this.trainWorkFlow.length < 1) {
      throw new BadRequestException('Cannot add coach/block to an empty train workflow');
    }

    //check if the coach being added to last coach
    let lastCoach = this.trainWorkFlow[this.trainWorkFlow.length - 1];
    if (this.isLastRole(lastCoach.nextRole)) {
      throw new BadRequestException('Cannot add coach/block to a last coach');
    }

    // Check if the coach is allowed based on the last exiting coach;
    const allowed = this.isNextRoleAllowed(startRole, lastCoach.nextRole);
    if (!allowed) {
      throw new BadRequestException('Cannot add this coach/block due to role mismatch with the last block in workflow');
    }

    // If allowed, perform connection
    this.trainWorkFlow.push({
      startRole,
      presentRole,
      actionBy,
      nextRole,
    });

    return {
      data: this.trainWorkFlow,
      message: `Coach ${presentRole} connected to the workflow`,
      status: 'SUCCESS',
    };
  }

  connectPantry(startRole: string[], presentRole: string, nextRole: string[], type: PantryType, actionBy?: string[]): ResponseDto {
    //check if the workflow is empty, then give error
    if (this.trainWorkFlow.length < 1) {
      throw new BadRequestException('Cannot add pantry/block to an empty train workflow');
    }

    //check if the pantry being added to last block
    let lastBlock = this.trainWorkFlow[this.trainWorkFlow.length - 1];
    if (this.isLastRole(lastBlock.nextRole)) {
      throw new BadRequestException('Cannot add pantry/block to a last block');
    }

    // Check if the pantry is allowed based on the last existing block;
    const allowed = this.isNextRoleAllowed(startRole, lastBlock.nextRole);
    if (!allowed) {
      throw new BadRequestException('Cannot add this pantry/block due to role mismatch with the last block in workflow');
    }

    //check if the type of pantry is not specified
    if (!type) {
      throw new BadRequestException('Pantry type cannot be empty');
    }

    if (!isValidPantryType(type)) {
      throw new BadRequestException('Invalid Pantry type');
    }

    // If allowed, perform connection
    let pantry: Pantry = {
      startRole,
      presentRole,
      actionBy,
      type,
      nextRole,
    };
    this.trainWorkFlow.push(pantry);

    return {
      data: this.trainWorkFlow,
      message: `Block ${presentRole} connected to the workflow`,
      status: 'SUCCESS',
    };
  }

  disconnectLastBlock(): ResponseDto {
    if (this.trainWorkFlow.length < 1) {
      throw new BadRequestException('Train workflow is empty');
    }

    const lastBlock = this.trainWorkFlow[this.trainWorkFlow.length - 1];

    this.trainWorkFlow.pop();

    return {
      data: this.trainWorkFlow,
      message: `Block ${lastBlock.presentRole} removed from the train workflow.`,
      status: 'SUCCESS',
    };
  }

  actionsByBlock(num: number): ResponseDto {
    if (this.trainWorkFlow.length < 1) {
      throw new BadRequestException('Train workflow is empty');
    }

    if (num > this.trainWorkFlow.length) {
      throw new BadRequestException('No such block exist');
    }

    let block = this.trainWorkFlow[num - 1];

    if (!block.actionBy) {
      return {
        message: `No action for this block`,
        status: 'SUCCESS',
      };
    } else {
      return {
        data: `${block.presentRole} takes action due to ${block.actionBy}`,
        message: `Block details`,
        status: 'SUCCESS',
      };
    }
  }

  printWorkFlow(): ResponseDto {
    return {
      data: this.trainWorkFlow,
      message: `Print Workflow`,
      status: 'SUCCESS',
    };
  }

  private isNextRoleAllowed(roles: string[], allowedRoles: string[]): boolean {
    if (allowedRoles.length < 1 || roles.length < 1) {
      throw new BadRequestException('Invalid Roles');
    }
    const isAnyStartRoleInNextRole = roles.some((role) => allowedRoles.includes(role));
    return isAnyStartRoleInNextRole;
  }

  private isLastRole(lastRole: string[]): boolean {
    const hasNoneRole = lastRole[0].toLowerCase() === 'none';
    return hasNoneRole;
  }
}
