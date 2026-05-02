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
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { PinoLogger } from 'nestjs-pino';
import {
  FindAllVoucherDto as FindAllDto,
  FindByIdVoucherDto as FindByIdDto,
} from './vouchers.interface';
import type { WebResponse } from 'src/common/common.interface';
import { PaginationDto } from 'src/common/common.dto';

@Controller('vouchers')
export class VouchersController {
  constructor(
    private readonly service: VouchersService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(VouchersController.name);
  }

  @Post()
  create(@Body() body: CreateVoucherDto): Promise<WebResponse> {
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
    @Body() body: UpdateVoucherDto,
  ): Promise<WebResponse> {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<WebResponse> {
    return this.service.remove(id);
  }
}
