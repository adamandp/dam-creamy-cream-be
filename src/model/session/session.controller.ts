import { Controller, Post, Request } from '@nestjs/common';
import { SessionService } from './session.service';
import type { CookieRequest, WebResponse } from 'src/common/common.interface';
import { RefreshAccessTokenResDto } from './session.interface';
import { PinoLogger } from 'nestjs-pino';

@Controller('sessions')
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(SessionController.name);
  }

  @Post('refresh')
  async refreshAccessToken(
    @Request() request: CookieRequest,
  ): Promise<WebResponse<RefreshAccessTokenResDto>> {
    return await this.sessionService.refreshAccessToken(request);
  }
}
