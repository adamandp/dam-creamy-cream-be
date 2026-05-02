import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductDiscountsService } from './product-discounts.service';
import { CreateProductDiscountDto } from './dto/create-product-discount.dto';
import { PinoLogger } from 'nestjs-pino';
import { PaginationDto } from 'src/common/common.dto';
import {
  FindAllProductDiscountResDto as FindAllDto,
  FindByIdProductDiscountResDto as FindByIdDto,
  FindByProductIdProductDiscountResDto as FindByProductIdDto,
} from './product-discounts.interface';
import { WebResponse } from 'src/common/common.interface';

@Controller('product-discounts')
export class ProductDiscountsController {
  constructor(
    private readonly service: ProductDiscountsService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ProductDiscountsController.name);
  }

  @Post()
  create(@Body() body: CreateProductDiscountDto): Promise<WebResponse> {
    return this.service.create(body);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
  ): Promise<WebResponse<FindAllDto>> {
    return this.service.findAll(pagination);
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<WebResponse<FindByIdDto>> {
    return this.service.findById(id);
  }

  @Get('product/:productId')
  findByProductId(
    @Param('productId') productId: string,
  ): Promise<WebResponse<FindByProductIdDto>> {
    return this.service.findByProductId(productId);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<WebResponse> {
    return this.service.remove(id);
  }
}
