import { Global, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { loggerConfig } from '../config/logger.config';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    LoggerModule.forRootAsync(loggerConfig),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class CommonModule {}
