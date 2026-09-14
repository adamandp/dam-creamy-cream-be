import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CookieRequest } from 'src/common/common.interface';
import { UnauthorizedException } from 'src/exceptions';
import { JwtPayload } from 'src/model/session/session.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request: CookieRequest = ctx.switchToHttp().getRequest();
    const jwt = new JwtService();

    const refreshtoken = request.cookies.refreshToken;

    if (!refreshtoken) {
      throw new UnauthorizedException();
    }

    return jwt.decode(refreshtoken?.replace('Bearer ', ''));
  },
);
