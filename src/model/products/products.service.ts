import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
// import { PrismaService } from 'src/common/prisma.module';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PinoLogger } from 'nestjs-pino';
import { UploadService } from 'src/common/upload.service';
import { CategoriesService } from '../categories/categories.service';
import { WebResponse } from 'src/common/common.interface';
import { Messages } from 'src/utils/message.helper';
import { PaginationDto } from 'src/common/common.dto';
import { NotFoundException } from 'src/exceptions';
import {
  FindAllProductResDto as FindAllDto,
  FindCatalogProductResDto as FindCatalogDto,
  ValidateProductDto as ValidateDto,
  // FindDetailProductResDto as FindDetailDto,
} from './products.interface';
import { validateUpdate } from 'src/utils/validate-update';
import { DiscountType } from 'src/generated/prisma/enums';
import { ProductQueryDto } from './dto/product-query.dto';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: PinoLogger,
    private readonly categories: CategoriesService,
    private readonly upload: UploadService,
  ) {
    this.logger.setContext(ProductsService.name);
  }

  private name = 'Product';

  async validateProduct(id: string): Promise<WebResponse<ValidateDto>> {
    return await this.prisma.product
      .findUniqueOrThrow({
        where: { id },
      })
      .then((data) => ({ message: Messages.get(this.name), data }));
  }

  async create({
    categoryId,
    ...data
  }: CreateProductDto): Promise<WebResponse> {
    await this.categories.validateCategory(categoryId);
    return await this.prisma.product
      .create({
        data: {
          ...data,
          categories: { connect: { id: categoryId } },
        },
      })
      .then(() => ({
        message: Messages.create(this.name),
      }));
  }

  async findAll({
    limit,
    page,
  }: PaginationDto): Promise<WebResponse<FindAllDto>> {
    this.logger.trace('findAll products service method called');
    const skip = Math.max((page - 1) * limit, 0);
    return await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
      }),
      this.prisma.product.count(),
    ]).then(([products, total]) => {
      if (!total) throw new NotFoundException(this.name);
      return {
        message: Messages.get(this.name),
        data: products,
        paging: {
          currentPage: page,
          pageSize: limit,
          totalItems: total,
          totalPages: Math.ceil(total / (limit || 1)),
        },
      };
    });
  }

  async findCatalog({
    limit,
    page,
    cat,
    min,
    max,
    q,
    sort,
  }: ProductQueryDto): Promise<WebResponse<FindCatalogDto[]>> {
    this.logger.trace('findAll products service method called');

    const skip = Math.max((page - 1) * limit, 0);

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (cat) {
      const categoryIds = cat.split(',');

      where.categoryId = {
        in: categoryIds,
      };
    }

    if (typeof min === 'number' || typeof max === 'number') {
      where.price = {};
      if (typeof min === 'number') where.price.gte = min;
      if (typeof max === 'number') where.price.lte = max;
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };

    if (sort === 'asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'desc') {
      orderBy = { price: 'desc' };
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        where,
        orderBy,
        select: {
          id: true,
          name: true,
          imageUrl: true,
          description: true,
          price: true,
          reviews: {
            select: {
              rating: true,
            },
          },
          productDiscounts: {
            where: { isActive: true },
            select: {
              discounts: {
                select: {
                  discountType: true,
                  value: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.product.count({ where }), // <- Harus memakai 'where' yang sama agar total halamannya akurat
    ]);

    if (!total && page === 1) {
      throw new NotFoundException(this.name);
    }

    const mappedProducts: FindCatalogDto[] = products.map((product) => {
      const totalReviews = product.reviews.length;
      const rate = totalReviews
        ? product.reviews.reduce((acc, item) => acc + (item.rating || 0), 0) /
          totalReviews
        : 0;

      const activeDiscount = product.productDiscounts?.discounts;
      let discountPrice: number | null = null;
      let discountType: DiscountType | null = null;
      let discountValue: number | null = null;
      let discountAmount = 0;

      if (activeDiscount?.value) {
        discountType = activeDiscount.discountType;
        discountValue = activeDiscount.value;
        switch (activeDiscount.discountType) {
          case DiscountType.FIXED:
            discountAmount = activeDiscount.value;
            break;
          case DiscountType.PERCENTAGE:
            discountAmount = (activeDiscount.value * product.price) / 100;
            break;
        }
        discountPrice = product.price - discountAmount;
      }

      return {
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl || '',
        description: product.description || '',
        rate,
        price: product.price,
        discountPrice,
        discountType,
        discountValue,
      };
    });

    return {
      message: Messages.get(this.name),
      data: mappedProducts,
      paging: {
        currentPage: page,
        pageSize: limit,
        totalItems: total,
        totalPages: Math.ceil(total / (limit || 1)),
      },
    };
  }

  async update(id: string, body: UpdateProductDto): Promise<WebResponse> {
    const exsitingData = (await this.validateProduct(id)).data;
    validateUpdate(body, exsitingData!);
    return await this.prisma.product
      .update({
        where: { id },
        data: body,
      })
      .then(() => ({ message: Messages.update(this.name) }));
  }

  async updateImage(
    id: string,
    file: Express.Multer.File,
  ): Promise<WebResponse> {
    const { imageUrl } = await this.prisma.product.findUniqueOrThrow({
      where: { id },
      select: { imageUrl: true },
    });
    if (imageUrl !== null) await this.upload.deleteImage(id);
    return await this.prisma.product
      .update({
        where: { id },
        data: {
          imageUrl: (await this.upload.uploadImage(file, id)).secure_url,
        },
      })
      .then(() => ({ message: Messages.update('Product Image') }));
  }

  async remove(id: string): Promise<WebResponse> {
    return await this.prisma.product
      .delete({ where: { id } })
      .then(() => ({ message: Messages.delete(this.name) }));
  }
}
