import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/common/prisma.module';
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
} from './products.interface';
import { validateUpdate } from 'src/utils/validate-update';

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
  }: PaginationDto): Promise<WebResponse<FindCatalogDto[]>> {
    this.logger.trace('findAll products service method called');

    const skip = Math.max((page - 1) * limit, 0);

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        // skip,
        // take: limit,
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          imageUrl: true,
          description: true,
          price: true,
          productDiscounts: {
            // where: {
            //   discounts: {
            //     endDate: { gt: new Date() },
            //   },
            // },
            select: {
              isActive: true,
              discounts: {
                select: {
                  discountType: true,
                  value: true,
                  productId: true,
                  quantity: true,
                },
              },
            },
          },
          inventory: {
            select: {
              quantity: true,
              reservedQuantity: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      }),
      this.prisma.product.count({ where: { isActive: true } }),
    ]);

    if (!total) throw new NotFoundException(this.name);

    const mappedProducts: FindCatalogDto[] = products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      imageUrl: p.imageUrl,
      productDiscounts: p.productDiscounts,
      inventory: {
        quantity:
          (p.inventory?.quantity ?? 0) - (p.inventory?.reservedQuantity ?? 0),
      },
      rating:
        p.reviews.length > 0
          ? p.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
            p.reviews.length
          : 0,
    }));

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

  // async findCatalog({ limit, page }: PaginationDto): Promise<WebResponse> {
  //   this.logger.trace('findAll products service method called');

  //   const skip = Math.max((page - 1) * limit, 0);

  //   const [productsDiscount, total] = await Promise.all([
  //     this.prisma.product.findMany({
  //       include: {
  //         productDiscounts: true,
  //       },
  //     }),

  //     this.prisma.product.count({ where: { isActive: true } }),
  //   ]);

  //   if (!total) throw new NotFoundException(this.name);

  //   return {
  //     message: Messages.get(this.name),
  //     data: productsDiscount.filter((p) => p.productDiscounts !== null),
  //     paging: {
  //       currentPage: page,
  //       pageSize: limit,
  //       totalItems: total,
  //       totalPages: Math.ceil(total / (limit || 1)),
  //     },
  //   };
  // }

  async findDetail(id: string) {
    return await this.prisma.product
      .findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          categoryId: true,
          discountId: true,
          name: true,
          imageUrl: true,
          description: true,
          price: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          productDiscounts: {
            select: {
              discounts: {
                select: {
                  value: true,
                  discountType: true,
                },
              },
            },
          },
          categories: {
            select: {
              id: true,
              name: true,
            },
          },
          inventory: {
            select: {
              quantity: true,
              reservedQuantity: true,
            },
          },
          productAnalytics: {
            where: {
              productId: id,
            },
          },
          reviews: {
            where: {
              productId: id,
            },
            select: {
              id: true,
              rating: true,
              comment: true,
              createdAt: true,
              users: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
      })
      .then((product) => ({ message: Messages.get(this.name), data: product }));
  }

  async update(id: string, body: UpdateProductDto): Promise<WebResponse> {
    const exsitingData = (await this.findDetail(id)).data;
    validateUpdate(body, exsitingData);
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
