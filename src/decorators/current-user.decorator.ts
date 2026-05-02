import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CookieRequest } from 'src/common/common.interface';
import { JwtPayload } from 'src/model/session/session.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request: CookieRequest = ctx.switchToHttp().getRequest();
    const jwt = new JwtService();
    const authHeader = request.headers.authorization || '';
    console.log(authHeader);
    const payload: JwtPayload = jwt.decode(authHeader?.replace('Bearer ', ''));
    return payload;
  },
);
