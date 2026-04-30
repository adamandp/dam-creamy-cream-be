import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const secret = {
  cookie: configService.get<string>('COOKIE_SECRET_KEY') as string,
};
