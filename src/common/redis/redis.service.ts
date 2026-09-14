import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class RedisService
  extends Redis
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    super(configService.getOrThrow<string>('REDIS_URL'));
    this.logger.setContext(RedisService.name);
  }

  async onModuleInit() {
    await this.ping();
  }

  async onModuleDestroy() {
    await this.quit();
  }

  async getJson<T>(key: string): Promise<T | null> {
    const value = await this.get(key);

    if (!value) return null;

    this.logger.debug(`Cache hit: ${key}`);

    return JSON.parse(value) as T;
  }

  async setJson(key: string, value: unknown, ttl = 60) {
    this.logger.debug(`Cache set: ${key}`);
    await this.set(key, JSON.stringify(value), 'EX', ttl);
  }
}
