import { Injectable } from '@nestjs/common';
import { WebResponse } from 'src/common/common.interface';
import { FindOneProductResDto } from './products.interface';
// import { PrismaService } from 'src/common/prisma.module';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PinoLogger } from 'nestjs-pino';
import { DiscountType } from 'src/generated/prisma/enums';
import { Messages } from 'src/utils/message.helper';
import { ProductInformationSchema } from './product.validation';
import { productInformationBuilder } from 'src/utils/product-information.builder';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ProductService.name);
  }

  private name = 'Product';

  async findOne(id: string): Promise<WebResponse<FindOneProductResDto>> {
    const product = await this.prisma.product.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        description: true,
        price: true,
        categories: {
          select: {
            name: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        orderItems: {
          select: {
            quantity: true,
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
    });

    const totalReviews = product.reviews.length;
    const rate = totalReviews
      ? product.reviews.reduce((acc, item) => acc + (item.rating || 0), 0) /
        totalReviews
      : 0;
    const sales = product.orderItems.reduce(
      (acc, item) => acc + (item.quantity || 0),
      0,
    );

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

    const mappedProducts: FindOneProductResDto = {
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl || '',
      description: product.description || '',
      rate,
      category: product.categories?.name || '',
      sales,
      price: product.price,
      discountPrice,
      discountType,
      discountValue,
    };

    return {
      message: Messages.get(this.name),
      data: mappedProducts,
    };
  }

  async findInformation(id: string): Promise<WebResponse> {
    const [productInformation, product] = await Promise.all([
      this.prisma.productInformation.findUniqueOrThrow({
        where: {
          productId: id,
        },
        omit: {
          id: true,
          productId: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.product.findUniqueOrThrow({
        where: {
          id,
        },
        select: {
          description: true,
        },
      }),
    ]);

    const parsed = ProductInformationSchema.parse({
      highlights: productInformation.highlights,
      servingSuggestions: productInformation.servingSuggestions,
      productDetails: productInformation.productDetails,
    });

    const information = productInformationBuilder(
      product.description || '',
      productInformation.whyChoose,
      parsed,
    );

    this.logger.debug(information);

    return {
      message: Messages.get(this.name),
      data: {
        information,
      },
    };
  }
}
