import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PinoLogger } from 'nestjs-pino';
import { PaginationDto } from 'src/common/common.dto';
import {
  FindByIdNotificationDto as FindByIdDto,
  FindAllNotificationsDto as FindAllDto,
} from './notifications.interface';
import { WebResponse } from 'src/common/common.interface';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly service: NotificationsService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(NotificationsController.name);
  }

  @Post()
  create(@Body() body: CreateNotificationDto): Promise<WebResponse> {
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

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateNotificationDto,
  ): Promise<WebResponse> {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<WebResponse> {
    return this.service.remove(id);
  }
}
