import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { CookieRequest, WebResponse } from 'src/common/common.interface';
import type { Response } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { LoginResDto } from './dto/login.dto';
import moment from 'moment-timezone';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @Post('dummy-customer-login')
  async dummyLogin(
    @Req() request: CookieRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<WebResponse<LoginResDto>> {
    const { message, data } = await this.authService.dummyLogin(request);
    response.cookie('refreshToken', data!.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      expires: moment()
        .tz('Asia/Jakarta')
        .add(7 * 24 * 60 * 60 * 1000, 'milliseconds')
        .toDate(),
    });
    return {
      message,
      data: {
        accessToken: data!.accessToken,
      },
    };
  }

  @Post('logout')
  async logout(
    @Req() request: CookieRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.clearCookie('refreshToken');
    return await this.authService.logout(request);
  }

  @Post('logout-all')
  async logoutAll(
    @Req() request: CookieRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.clearCookie('refreshToken');
    return await this.authService.logoutAll(request);
  }
}
