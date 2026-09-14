import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CookieRequest, WebResponse } from 'src/common/common.interface';
import { CreateTokenDto } from '../session/session.interface';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SessionService } from '../session/session.service';
import { PinoLogger } from 'nestjs-pino';
import { RolesService } from '../roles/roles.service';
import { InternalServerErrorException } from 'src/exceptions';
import { LoginServiceResDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionService: SessionService,
    private readonly logger: PinoLogger,
    private readonly roles: RolesService,
  ) {
    this.logger.setContext(AuthService.name);
  }

  private async validatePassword(requestPassword: string, password: string) {
    return await bcrypt
      .compare(requestPassword, password)
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException();
      })
      .then((res) => {
        if (!res)
          throw new UnauthorizedException(
            '🚫 Login failed. Please check your identifier and password, then try again! 🔍',
          );
      });
  }

  async dummyLogin(
    request: CookieRequest,
  ): Promise<WebResponse<LoginServiceResDto>> {
    const exsitingRefreshToken = request.cookies?.refreshToken;
    const identifier = 'DummyUser';
    const password = '@Password123';
    const { data } = await this.usersService.findDetail(identifier);

    await this.validatePassword(password, data?.password as string);
    const generateTokenPayload: CreateTokenDto = {
      refreshToken: exsitingRefreshToken || '',
      payload: {
        sub: data!.id,
        role: data!.roleId,
      },
      browserInfo: {
        userAgent: `dummy-${request.headers['user-agent'] || 'unkown'}`,
        ip: request.ip || 'unkown',
      },
    };
    return {
      message: `🔓 Welcome back, ${data?.username ?? identifier}! You have logged in successfully! 🎉`,
      data: (await this.sessionService.dummyCreateToken(generateTokenPayload))
        .data,
    };
  }

  async logout(request: CookieRequest) {
    await this.sessionService.clearToken(request.cookies.refreshToken || '');
    return {
      message: '🎉 You have logged out successfully! see u lateer',
    };
  }

  async logoutAll(request: CookieRequest) {
    await this.sessionService.clearAllToken(request.cookies.refreshToken || '');
    return {
      message: '🎉 You have logged out all sessions successfully! see u lateer',
    };
  }
}
