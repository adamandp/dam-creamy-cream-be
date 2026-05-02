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
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { PaginationDto } from 'src/common/common.dto';
import { PinoLogger } from 'nestjs-pino';
import {
  FindAllResDiscountDto as FindAllDto,
  FindByIdResDiscountDto as FindByIdDto,
} from './discounts.interface';
import { WebResponse } from 'src/common/common.interface';

@Controller('discounts')
export class DiscountsController {
  constructor(
    private readonly discountsService: DiscountsService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(DiscountsController.name);
  }

  @Post()
  create(@Body() body: CreateDiscountDto): Promise<WebResponse> {
    return this.discountsService.create(body);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
  ): Promise<WebResponse<FindAllDto>> {
    return this.discountsService.findAll(pagination);
  }

  @Get(':id')
  findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WebResponse<FindByIdDto>> {
    return this.discountsService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ): Promise<WebResponse> {
    return this.discountsService.update(id, updateDiscountDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<WebResponse> {
    return this.discountsService.remove(id);
  }
}
