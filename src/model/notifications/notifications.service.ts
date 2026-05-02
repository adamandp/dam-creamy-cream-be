import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import {
  ValidateNotificationDto as ValidateDto,
  FindByIdNotificationDto as FindByIdDto,
  FindAllNotificationsDto as FindAllDto,
} from './notifications.interface';
import { WebResponse } from 'src/common/common.interface';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from 'src/common/prisma.module';
import { Messages } from 'src/utils/message.helper';
import { PaginationDto } from 'src/common/common.dto';
import { NotFoundException } from 'src/exceptions';
import { validateUpdate } from 'src/utils/validate-update';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly prisma: PrismaService,
  ) {
    this.logger.setContext(NotificationsService.name);
  }

  private name = 'Notification';

  async create(body: CreateNotificationDto): Promise<WebResponse> {
    return await this.prisma.notification
      .create({ data: body })
      .then(() => ({ message: Messages.create(this.name) }));
  }

  async findAll({
    limit,
    page,
  }: PaginationDto): Promise<WebResponse<FindAllDto>> {
    const skip = Math.max((page - 1) * limit, 0);
    return await Promise.all([
      this.prisma.notification.findMany({
        skip,
        take: limit,
      }),
      this.prisma.notification.count(),
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

  async validateNotification(id: string): Promise<WebResponse<ValidateDto>> {
    return await this.prisma.notification
      .findUniqueOrThrow({ where: { id } })
      .then((data) => ({ message: Messages.get(this.name), data }));
  }

  async findById(id: string): Promise<WebResponse<FindByIdDto>> {
    return await this.prisma.notification
      .findUniqueOrThrow({ where: { id } })
      .then((data) => ({ message: Messages.get(this.name), data }));
  }

  async update(id: string, body: UpdateNotificationDto): Promise<WebResponse> {
    const exsitingData = await this.validateNotification(id);
    return await this.prisma.notification
      .update({ where: { id }, data: validateUpdate(body, exsitingData.data!) })
      .then(() => ({ message: Messages.update(this.name) }));
  }

  async remove(id: string): Promise<WebResponse> {
    await this.validateNotification(id);
    return await this.prisma.notification
      .delete({ where: { id } })
      .then(() => ({ message: Messages.delete(this.name) }));
  }
}
