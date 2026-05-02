import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Request,
  Query,
} from '@nestjs/common';
import { ProductAnalyticsService } from './product-analytics.service';
import { CreateProductAnalyticDto } from './dto/create-product-analytic.dto';
import { PinoLogger } from 'nestjs-pino';
import type { CookieRequest, WebResponse } from 'src/common/common.interface';
import {
  FindByProductProductAnalyticsDto as FindByProductDto,
  FindByUserProductAnalyticsDto as FindByUserDto,
  FindByProductCountProductAnalyticsDto as FindByProductCountDto,
} from './product-analytics.interface';
import { PaginationDto } from 'src/common/common.dto';

@Controller('product-analytics')
export class ProductAnalyticsController {
  constructor(
    private readonly service: ProductAnalyticsService,
    private readonly loger: PinoLogger,
  ) {
    this.loger.setContext(ProductAnalyticsController.name);
  }

  @Post()
  create(@Body() body: CreateProductAnalyticDto): Promise<WebResponse> {
    return this.service.create(body);
  }

  @Get('product/:id')
  async findByProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() { limit, page }: PaginationDto,
  ): Promise<WebResponse<FindByProductDto>> {
    return this.service.findByProduct(id, { limit, page });
  }

  @Get('user')
  async findByUser(
    @Request() request: CookieRequest,
    @Query() { limit, page }: PaginationDto,
  ): Promise<WebResponse<FindByUserDto>> {
    return this.service.findByUser(request, { limit, page });
  }

  @Get('product/:id/count')
  async findByProductCount(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WebResponse<FindByProductCountDto>> {
    return this.service.findByProductCount(id);
  }
}
