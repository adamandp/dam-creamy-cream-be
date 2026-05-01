import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UploadedFile,
  UseInterceptors,
  Query,
  Put,
  Request as RequestDecorator,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/common.dto';
import { WebResponse } from 'src/common/common.interface';
import {
  FindAllUserResDto as FindAllDto,
  FindProfileUserDto as FindProfileDto,
  FindOneUserDto as FindOneDto,
} from './users.interface';
import { PinoLogger } from 'nestjs-pino';
import { UpdateUserPasswordDto } from './dto/update-user-password';
import type { Request } from 'express';
import { multerOptions } from 'src/config/multer.config';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UsersController.name);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
  ): Promise<WebResponse<FindAllDto>> {
    return this.usersService.findAll(pagination);
  }

  @Get('/profile')
  findProfile(
    @RequestDecorator() request: Request,
  ): Promise<WebResponse<FindProfileDto>> {
    return this.usersService.findProfile(request);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WebResponse<FindOneDto>> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserDto,
  ): Promise<WebResponse> {
    return this.usersService.update(id, body);
  }

  @Put(':id/password')
  updatePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserPasswordDto,
  ): Promise<WebResponse> {
    return this.usersService.updatePassword(id, body);
  }

  @Put(':id/image')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  updateImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<WebResponse> {
    return this.usersService.updateImage(id, file);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<WebResponse> {
    return this.usersService.remove(id);
  }
}
