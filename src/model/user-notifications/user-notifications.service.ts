import { Injectable } from '@nestjs/common';
import { CreateUserNotificationDto } from './dto/create-user-notification.dto';
import { PinoLogger } from 'nestjs-pino';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CookieRequest, WebResponse } from 'src/common/common.interface';
import { PrismaService } from 'src/common/prisma.module';
import { Messages } from 'src/utils/message.helper';
import { PaginationDto } from 'src/common/common.dto';
import { NotFoundException, UnauthorizedException } from 'src/exceptions';
import {
  ValidateUserNotificationDto as ValidateDto,
  FindAllUserNotificationDto as FindAllDto,
  FindByIdUserNotificationDto as FindByIdDto,
  FindByUserUserNotificationDto as FindByUserDto,
  FindByUserCountUserNotificationDto as FindByUserCountDto,
  FindByNotifiactionUserNotificationDto as FindByNotifiactionDto,
  FindByNotifiactionCountUserNotificationDto as FindByNotificationCount,
} from './user-notifications.interface';
import { JwtPayload } from '../session/session.interface';

@Injectable()
export class UserNotificationsService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly jwt: JwtService,
    private readonly user: UsersService,
    private readonly notification: NotificationsService,
    private readonly prisma: PrismaService,
  ) {
    this.logger.setContext(UserNotificationsService.name);
  }

  private name = 'User Notification';

  async create(body: CreateUserNotificationDto): Promise<WebResponse> {
    await this.user.validateUser(body.userId);
    await this.notification.validateNotification(body.notificationId);
    return this.prisma.userNotification
      .create({ data: body })
      .then(() => ({ message: Messages.create(this.name) }));
  }

  async findAll({
    limit,
    page,
  }: PaginationDto): Promise<WebResponse<FindAllDto>> {
    const skip = Math.max((page - 1) * limit, 0);
    return await Promise.all([
      this.prisma.userNotification.findMany({
        skip,
        take: limit,
        include: { notifications: true },
      }),
      this.prisma.userNotification.count(),
    ]).then(([data, total]) => {
      if (total <= 0) throw new NotFoundException(this.name);
      return {
        message: Messages.get(this.name),
        data,
        paging: {
          currentPage: page,
          pageSize: limit,
          totalItems: total,
          totalPages: Math.ceil(total / (limit || 1)),
        },
      };
    });
  }

  async validateUserNotification(
    id: string,
  ): Promise<WebResponse<ValidateDto>> {
    return await this.prisma.userNotification
      .findUniqueOrThrow({ where: { id } })
      .then((data) => ({ message: Messages.get(this.name), data }));
  }

  async findById(id: string): Promise<WebResponse<FindByIdDto>> {
    return await this.prisma.userNotification
      .findUniqueOrThrow({ where: { id }, include: { notifications: true } })
      .then((data) => ({ message: Messages.get(this.name), data }));
  }

  async updateRead(id: string): Promise<WebResponse> {
    await this.validateUserNotification(id);
    return await this.prisma.userNotification
      .update({
        where: { id },
        data: { isRead: true },
      })
      .then(() => ({ message: Messages.update(this.name) }));
  }

  async findByUser(
    request: CookieRequest,
    { limit, page }: PaginationDto,
  ): Promise<WebResponse<FindByUserDto>> {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
      throw new UnauthorizedException();
    const { sub }: JwtPayload = await this.jwt.decode(
      authHeader.replace('Bearer ', ''),
    );
    const skip = Math.max((page - 1) * limit, 0);
    return await Promise.all([
      this.prisma.userNotification.findMany({
        where: { userId: sub },
        skip,
        take: limit,
        include: { notifications: true },
      }),
      this.prisma.userNotification.count({ where: { userId: sub } }),
    ]).then(([data, total]) => {
      if (total <= 0) throw new NotFoundException(this.name);
      return {
        message: Messages.get(this.name),
        data,
        paging: {
          currentPage: page,
          pageSize: limit,
          totalItems: total,
          totalPages: Math.ceil(total / (limit || 1)),
        },
      };
    });
  }

  async findByNotification(
    id: string,
    { limit, page }: PaginationDto,
  ): Promise<WebResponse<FindByNotifiactionDto>> {
    await this.notification.validateNotification(id);
    const skip = Math.max((page - 1) * limit, 0);
    return await Promise.all([
      this.prisma.userNotification.findMany({
        where: { userId: id },
        skip,
        take: limit,
        include: { notifications: true },
      }),
      this.prisma.userNotification.count({ where: { userId: id } }),
    ]).then(([data, total]) => {
      if (total <= 0) throw new NotFoundException(this.name);
      return {
        message: Messages.get(this.name),
        data,
        paging: {
          currentPage: page,
          pageSize: limit,
          totalItems: total,
          totalPages: Math.ceil(total / (limit || 1)),
        },
      };
    });
  }

  async findByNotificationCount(
    id: string,
  ): Promise<WebResponse<FindByNotificationCount>> {
    await this.notification.validateNotification(id);
    return await this.prisma.userNotification
      .count({ where: { userId: id } })
      .then((data) => ({
        message: Messages.get(this.name),
        data: { count: data },
      }));
  }

  async findByUserCount(
    request: CookieRequest,
  ): Promise<WebResponse<FindByUserCountDto>> {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
      throw new UnauthorizedException();
    const { sub }: JwtPayload = await this.jwt.decode(
      authHeader.replace('Bearer ', ''),
    );
    return await this.prisma.userNotification
      .count({ where: { userId: sub } })
      .then((data) => ({
        message: Messages.get(this.name),
        data: { count: data },
      }));
  }
}
