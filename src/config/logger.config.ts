import { LoggerModuleAsyncParams } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';

export const loggerConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const isDev = config.get<string>('NODE_ENV') !== 'production';
    return {
      pinoHttp: {
        level: config.get('LOG_LEVEL') || 'trace',
        transport: isDev
          ? {
              target: 'pino-pretty',
              level: 'trace',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
              },
            }
          : // :
            {
              targets: [
                {
                  target: 'pino/file',
                  level: 'error',
                  options: { destination: './logs/error.log', mkdir: true },
                },
                {
                  target: 'pino/file',
                  level: 'warn',
                  options: { destination: './logs/warn.log', mkdir: true },
                },
                {
                  target: 'pino/file',
                  level: 'info',
                  options: { destination: './logs/info.log', mkdir: true },
                },
              ],
            },
        // undefined,
        autoLogging: true,
        serializers: {
          req(req: Request) {
            return {
              method: req.method,
              url: req.url,
              query: req.query,
              params: req.params,
              headers: req.headers,
            };
          },
          res(res: Response) {
            return res;
          },
        },
      },
    };
  },
};
