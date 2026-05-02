import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseUUIDPipe,
  Request,
} from '@nestjs/common';
import { UserNotificationsService } from './user-notifications.service';
import { CreateUserNotificationDto } from './dto/create-user-notification.dto';
import { PinoLogger } from 'nestjs-pino';
import type { CookieRequest, WebResponse } from 'src/common/common.interface';
import { PaginationDto } from 'src/common/common.dto';
import {
  FindAllUserNotificationDto as FindAllDto,
  FindByIdUserNotificationDto as FindByIdDto,
  FindByUserUserNotificationDto as FindByUserDto,
  FindByUserCountUserNotificationDto as FindByUserCountDto,
  FindByNotifiactionUserNotificationDto as FindByNotifiactionDto,
  FindByNotifiactionCountUserNotificationDto as FindByNotificationCount,
} from './user-notifications.interface';

@Controller('user-notifications')
export class UserNotificationsController {
  constructor(
    private readonly service: UserNotificationsService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UserNotificationsController.name);
  }

  @Post()
  create(@Body() body: CreateUserNotificationDto): Promise<WebResponse> {
    return this.service.create(body);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
  ): Promise<WebResponse<FindAllDto>> {
    return this.service.findAll(pagination);
  }

  @Get(':id')
  findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WebResponse<FindByIdDto>> {
    return this.service.findById(id);
  }

  @Get('me')
  findByUser(
    @Request() request: CookieRequest,
    @Query() pagination: PaginationDto,
  ): Promise<WebResponse<FindByUserDto>> {
    return this.service.findByUser(request, pagination);
  }

  @Get('count/me')
  findByUserCount(
    @Request() request: CookieRequest,
  ): Promise<WebResponse<FindByUserCountDto>> {
    return this.service.findByUserCount(request);
  }

  @Get('notification/:id')
  findByNotification(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() pagination: PaginationDto,
  ): Promise<WebResponse<FindByNotifiactionDto>> {
    return this.service.findByNotification(id, pagination);
  }

  @Get('notification/:id/count')
  findByNotificationCount(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WebResponse<FindByNotificationCount>> {
    return this.service.findByNotificationCount(id);
  }

  @Patch(':id')
  updateRead(@Param('id') id: string): Promise<WebResponse> {
    return this.service.updateRead(id);
  }
}
