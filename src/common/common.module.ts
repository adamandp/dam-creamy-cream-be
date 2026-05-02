import { Global, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { loggerConfig } from '../config/logger.config';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { CommonFilter } from './common.filter';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { ZodValidationPipe } from 'nestjs-zod';

@Global()
@Module({
  imports: [
    LoggerModule.forRootAsync(loggerConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ global: true }),
    HttpModule.register({ global: true }),
  ],
  providers: [
    PrismaService,
    LoggerModule,
    {
      provide: APP_PIPE,
      useValue: ZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: CommonFilter,
    },
  ],
  exports: [PrismaService],
})
export class CommonModule {}
