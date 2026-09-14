import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { CommonFilter } from './common.filter';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { ZodValidationPipe } from 'nestjs-zod';
import { CqrsModule } from '@nestjs/cqrs';
import { RedisModule } from './redis/redis.module';
import { AppLoggerModule } from './app-logger/app-logger.module';
import { PrismaModule } from './prisma/prisma.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ global: true }),
    HttpModule.register({ global: true }),
    CqrsModule.forRoot(),

    RedisModule,
    AppLoggerModule,
    PrismaModule,
  ],
  providers: [
    AppLoggerModule,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: CommonFilter,
    },
  ],
  exports: [PrismaModule, RedisModule],
})
export class CommonModule {}
