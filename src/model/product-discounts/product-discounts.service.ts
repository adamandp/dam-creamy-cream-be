import { Injectable } from '@nestjs/common';
import { CreateProductDiscountDto } from './dto/create-product-discount.dto';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from 'src/common/prisma.module';
import { ProductsService } from '../products/products.service';
import { DiscountsService } from '../discounts/discounts.service';
import { WebResponse } from 'src/common/common.interface';
import { Messages } from 'src/utils/message.helper';
import { PaginationDto } from 'src/common/common.dto';
import {
  ValidateProductDiscountDto as ValidateDto,
  FindAllProductDiscountResDto as FindAllDto,
  FindByIdProductDiscountResDto as FindByIdDto,
  FindByProductIdProductDiscountResDto as FindByProductIdDto,
} from './product-discounts.interface';
import { NotFoundException } from 'src/exceptions';

@Injectable()
export class ProductDiscountsService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly prisma: PrismaService,
    private readonly product: ProductsService,
    private readonly discount: DiscountsService,
  ) {
    this.logger.setContext(ProductDiscountsService.name);
  }

  private name = 'Product Discount';

  async validateProductDiscount(id: string): Promise<WebResponse<ValidateDto>> {
    return await this.prisma.productDiscount
      .findUniqueOrThrow({ where: { id } })
      .then((data) => ({ message: Messages.get(this.name), data }));
  }

  async create(body: CreateProductDiscountDto): Promise<WebResponse> {
    await this.product.validateProduct(body.productId);
    await this.discount.validateDiscount(body.discountId);
    return await this.prisma.productDiscount
      .create({ data: body })
      .then(() => ({ message: Messages.create(this.name) }));
  }

  async findAll({
    limit,
    page,
  }: PaginationDto): Promise<WebResponse<FindAllDto>> {
    const skip = Math.max((page - 1) * limit, 0);
    return await Promise.all([
      this.prisma.productDiscount.findMany({
        skip,
        take: limit,
      }),
      this.prisma.user.count(),
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

  async findById(id: string): Promise<WebResponse<FindByIdDto>> {
    return await this.prisma.productDiscount
      .findUniqueOrThrow({ where: { id } })
      .then((data) => ({ message: Messages.get(this.name), data }));
  }

  async findByProductId(id: string): Promise<WebResponse<FindByProductIdDto>> {
    return await this.prisma.productDiscount
      .findMany({ where: { productId: id } })
      .then((data) => ({ message: Messages.get(this.name), data }));
  }

  async remove(id: string): Promise<WebResponse> {
    return await this.prisma.productDiscount
      .update({
        where: { id },
        data: { isActive: false },
      })
      .then(() => ({ message: Messages.delete(this.name) }));
  }
}
