import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import {
  BrowserInfo,
  CreateTokenDto,
  CreateTokenResDto,
  JwtPayload,
  RefreshAccessTokenResDto,
} from './session.interface';
import { PrismaService } from 'src/common/prisma.module';
import { CookieRequest, WebResponse } from 'src/common/common.interface';
import { UAParser } from 'ua-parser-js';
import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from 'src/exceptions';

@Injectable()
export class SessionService {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: PinoLogger,
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {
    this.logger.setContext(SessionService.name);
    this.jwtConfig = {
      access: {
        secret: this.config.get('ACCESS_JWT_SECRET') as string,
        expiresIn: '15m',
      },
      refresh: {
        secret: this.config.get('REFRESH_JWT_SECRET') as string,
        expiresIn: '7d',
      },
    };

    this.jwtVerifyConfig = {
      access: {
        secret: this.config.get('ACCESS_JWT_SECRET') as string,
      },
      refresh: {
        secret: this.config.get('REFRESH_JWT_SECRET') as string,
      },
    };
  }

  private jwtConfig: {
    access: JwtSignOptions;
    refresh: JwtSignOptions;
  };

  private jwtVerifyConfig: {
    access: { secret: string };
    refresh: { secret: string };
  };

  private async createAccess(payload: JwtPayload): Promise<string> {
    return await this.jwt
      .signAsync(payload, this.jwtConfig.access)
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException();
      });
  }

  private async createRefresh(payload: JwtPayload): Promise<string> {
    return await this.jwt
      .signAsync(payload, this.jwtConfig.refresh)
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException();
      });
  }

  private createBrowserInfo({ ip, userAgent }: BrowserInfo) {
    const ua = UAParser(userAgent);
    return {
      ip,
      browser: `${ua.browser?.name ?? 'Unknown'} ${
        ua.browser?.version ?? 'Unknown'
      }`,
      os: `${ua.os?.name ?? 'Unknown'} ${ua.os?.version ?? 'Unknown'}`,
      device: ua.device?.type ?? 'Unknown',
    };
  }

  async createToken(
    request: CreateTokenDto,
  ): Promise<WebResponse<CreateTokenResDto>> {
    const { payload, browserInfo, refreshToken: exstingRefreshToken } = request;
    const accessToken = await this.createAccess(payload);
    const refreshToken = await this.createRefresh(payload);
    if (exstingRefreshToken) {
      await this.prisma.$transaction(async (tx) => {
        const validateToken = await tx.userToken.findFirst({
          where: {
            token: exstingRefreshToken,
          },
        });
        if (
          (validateToken?.expiredAt || new Date(Date.now() + 1000)) <
          new Date(Date.now())
        ) {
          throw new ForbiddenException(
            '✅ You are already logged in. No need to log in again! 🎉',
          );
        }
        await tx.userToken.update({
          where: { token: exstingRefreshToken },
          data: { token: accessToken },
        });
      });
    } else {
      await this.prisma.$transaction(async (tx) => {
        const count = await tx.userToken.count({
          where: { userId: payload.sub },
        });
        const lastestToken = await tx.userToken.findMany({
          where: { userId: payload.sub },
          select: { id: true },
          orderBy: { expiredAt: 'asc' },
        });
        if (count >= 5) {
          await tx.userToken.delete({
            where: { id: lastestToken[0].id },
          });
        }
        await tx.userToken.create({
          data: {
            userId: payload.sub,
            token: accessToken,
            expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            browserInfo: JSON.stringify(this.createBrowserInfo(browserInfo)),
          },
        });
      });
    }
    return {
      data: {
        refreshToken,
        accessToken,
      },
    };
  }

  async dummyCreateToken(
    request: CreateTokenDto,
  ): Promise<WebResponse<CreateTokenResDto>> {
    const { payload, browserInfo, refreshToken: exstingRefreshToken } = request;
    const accessToken = await this.createAccess(payload);
    const refreshToken = await this.createRefresh(payload);
    if (exstingRefreshToken) {
      await this.prisma.$transaction(async (tx) => {
        const validateToken = await tx.userToken.findFirst({
          where: {
            token: exstingRefreshToken,
          },
        });
        if (
          (validateToken?.expiredAt || new Date(Date.now() + 1000)) <
          new Date(Date.now())
        ) {
          throw new ForbiddenException(
            '✅ You are already logged in. No need to log in again! 🎉',
          );
        }
        await tx.userToken.update({
          where: { token: exstingRefreshToken },
          data: { token: accessToken },
        });
      });
    } else {
      await this.prisma.$transaction(async (tx) => {
        await tx.userToken.create({
          data: {
            userId: payload.sub,
            token: accessToken,
            expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            browserInfo: JSON.stringify(this.createBrowserInfo(browserInfo)),
          },
        });
      });
    }
    return {
      data: {
        refreshToken,
        accessToken,
      },
    };
  }

  async refreshAccessToken(
    request: CookieRequest,
  ): Promise<WebResponse<RefreshAccessTokenResDto>> {
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) throw new UnauthorizedException();
    const payload: JwtPayload = await this.jwt.decode(refreshToken);
    await this.jwt
      .verifyAsync(refreshToken, this.jwtVerifyConfig.refresh)
      .catch(() => {
        throw new UnauthorizedException();
      });
    return {
      data: {
        accessToken: await this.createRefresh(payload),
      },
    };
  }

  async clearToken(refreshToken: string): Promise<WebResponse> {
    await this.jwt
      .verifyAsync(refreshToken, this.jwtVerifyConfig.refresh)
      .catch(() => {
        throw new UnauthorizedException();
      });
    await this.prisma.userToken
      .delete({
        where: {
          token: refreshToken,
        },
      })
      .then((data) => {
        if (!data) throw new NotFoundException('Token');
      });
    return { message: '🎉 Token has been cleared! Please log in again! 🎉' };
  }

  async clearAllToken(refreshToken: string): Promise<WebResponse> {
    const { sub }: JwtPayload = await this.jwt.decode(refreshToken);
    await this.prisma.userToken
      .deleteMany({
        where: {
          userId: sub,
        },
      })
      .then((data) => {
        if (data.count === 0) throw new NotFoundException('Token');
      });
    return {
      message: '🎉 All tokens have been cleared! Please log in again! 🎉',
    };
  }
}
