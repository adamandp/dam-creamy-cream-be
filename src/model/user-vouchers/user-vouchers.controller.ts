import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  Request,
  Patch,
} from '@nestjs/common';
import { UserVouchersService } from './user-vouchers.service';
import { CreateUserVoucherDto } from './dto/create-user-voucher.dto';
import { PaginationDto } from 'src/common/common.dto';
import type { CookieRequest, WebResponse } from 'src/common/common.interface';
import { PinoLogger } from 'nestjs-pino';
import {
  FindByUserUserVoucherDto as FindByUserDto,
  FindByIdUserVoucherDto as FindByIdDto,
  FindAllUserVoucherDto as FindAllDto,
  FindByVoucherUserVoucherDto as FindByVoucherDto,
} from './user-vouchers.interface';

@Controller('user-vouchers')
export class UserVouchersController {
  constructor(
    private readonly service: UserVouchersService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UserVouchersController.name);
  }

  @Post()
  create(@Body() body: CreateUserVoucherDto): Promise<WebResponse> {
    return this.service.create(body);
  }

  @Patch(':id')
  use(@Param('id', ParseUUIDPipe) id: string): Promise<WebResponse> {
    return this.service.use(id);
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

  @Get('/user')
  findByUser(
    @Request() request: CookieRequest,
  ): Promise<WebResponse<FindByUserDto>> {
    return this.service.findByUser(request);
  }

  @Get('/voucher/:id')
  findByVoucher(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WebResponse<FindByVoucherDto>> {
    return this.service.findByVoucher(id);
  }
}
