import {
  Catch,
  ConflictException,
  ExceptionFilter,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { AxiosError } from 'axios';
import { startCase } from 'lodash';
import { PinoLogger } from 'nestjs-pino';

@Catch(PrismaClientKnownRequestError)
export class CommonFilter implements ExceptionFilter {
  constructor(private logger: PinoLogger) {
    this.logger.setContext(CommonFilter.name);
  }

  catch(exception: PrismaClientKnownRequestError | AxiosError) {
    if (exception instanceof PrismaClientKnownRequestError) {
      const model: string = startCase(exception.meta?.modelName as string);
      const field: string = startCase(exception.meta?.target as string);
      let message: string;

      switch (exception.code) {
        case 'P2002':
          message = `⚡ ${model}${field ? ` ${field}` : ''} already exists! No duplicates allowed! 😆`;
          this.logger.trace(message);
          throw new ConflictException(message);
        case 'P2025':
          message = `🔍 ${model}${field ? ` ${field}` : ''} not found. Maybe it teleported to another dimension? 🛸`;
          this.logger.trace(message);
          throw new NotFoundException(message);
        default: {
          this.logger.error(exception.message);
          throw new InternalServerErrorException(exception.message);
        }
      }
    }
    throw new InternalServerErrorException(`🚨 Server error 🚨`);
  }
}
