import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { WebResponse } from 'src/common/common.interface';
// import { PrismaService } from 'src/common/prisma.module';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { DiscountType } from 'src/generated/prisma/client';
import {
  ProductWithRelations,
  ProductRecomendationRes,
  CategoriesRecomendationRes,
} from './recommendations.interface';
import { ProductWhereInput } from 'src/generated/prisma/models';
import { Messages } from 'src/utils/message.helper';
import { NotFoundException } from 'src/exceptions';

@Injectable()
export class RecommendationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(RecommendationsService.name);
  }

  private mapProductToRecommendation(
    product: ProductWithRelations,
  ): ProductRecomendationRes {
    const totalReviews = product.reviews?.length || 0;

    const rate = totalReviews
      ? product.reviews.reduce(
          (acc: number, item: { rating: number }) => acc + (item.rating || 0),
          0,
        ) / totalReviews
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

        default:
          discountAmount = 0;
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
  }

  private sortByRatingAndSales<
    T extends {
      reviews: { rating: number }[];
      _count: { orderItems: number };
    },
  >(products: T[]): T[] {
    return products.sort((a, b) => {
      const avgRatingA =
        a.reviews.length > 0
          ? a.reviews.reduce((sum, review) => sum + review.rating, 0) /
            a.reviews.length
          : 0;

      const avgRatingB =
        b.reviews.length > 0
          ? b.reviews.reduce((sum, review) => sum + review.rating, 0) /
            b.reviews.length
          : 0;

      if (avgRatingB !== avgRatingA) {
        return avgRatingB - avgRatingA;
      }

      return b._count.orderItems - a._count.orderItems;
    });
  }

  async getClassicRecommendations(): Promise<
    WebResponse<ProductRecomendationRes[]>
  > {
    const whereClause: ProductWhereInput = {
      isActive: true,
      categories: {
        name: {
          contains: 'Classic',
          mode: 'insensitive',
        },
      },
    };

    const products = await this.prisma.product.findMany({
      where: whereClause,
      include: {
        reviews: { select: { rating: true } },
        productDiscounts: {
          where: { isActive: true },
          include: {
            discounts: { select: { discountType: true, value: true } },
          },
        },
        _count: {
          select: { orderItems: true },
        },
      },
      orderBy: {
        orderItems: {
          _count: 'desc',
        },
      },
    });
    const total = await this.prisma.product.count({ where: whereClause });

    const name = 'Classic Recommendations';

    if (!total) throw new NotFoundException(name);

    const mappedProducts = this.sortByRatingAndSales(products).map((product) =>
      this.mapProductToRecommendation(product),
    );

    return {
      message: Messages.get(name),
      data: mappedProducts,
    };
  }

  async getCategoriesRecommendations(): Promise<
    WebResponse<CategoriesRecomendationRes[]>
  > {
    this.logger.trace('getCategoriesRecommendations called');

    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      include: {
        products: {
          where: { isActive: true },
          include: {
            _count: { select: { orderItems: true } },
          },
          orderBy: {
            orderItems: { _count: 'desc' },
          },
          take: 1,
        },
      },
    });

    const name = 'Categories Recommendations';

    if (categories.length <= 0) throw new NotFoundException(name);

    const mappedCategories = categories
      .filter((cat) => cat.products.length > 0)
      .map((cat) => ({
        id: cat.products[0].id,
        imageUrl: cat.products[0].imageUrl || '',
        category: cat.name,
        categoryId: cat.id,
      }));

    return {
      message: Messages.get(name),
      data: mappedCategories,
    };
  }

  async getOfferRecommendations(): Promise<
    WebResponse<ProductRecomendationRes[]>
  > {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        productDiscounts: {
          isActive: true,
        },
      },
      include: {
        reviews: { select: { rating: true } },
        productDiscounts: {
          where: { isActive: true },
          include: {
            discounts: { select: { discountType: true, value: true } },
          },
        },
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
      take: 5,
    });

    const name = 'Offer Recommendations';

    if (products.length <= 0) throw new NotFoundException(name);

    const mappedProducts = products
      .sort((a, b) => {
        const getDiscountAmount = (product: typeof a) => {
          const discount = product.productDiscounts?.discounts;

          if (!discount) return 0;

          switch (discount.discountType) {
            case DiscountType.FIXED:
              return discount.value;

            case DiscountType.PERCENTAGE:
              return (discount.value || 0 * product.price) / 100;

            default:
              return 0;
          }
        };

        const discountA = getDiscountAmount(a);
        const discountB = getDiscountAmount(b);

        if (discountB !== discountA) {
          return (discountB || 0) - (discountA || 0);
        }

        const ratingA =
          a.reviews.length > 0
            ? a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length
            : 0;

        const ratingB =
          b.reviews.length > 0
            ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length
            : 0;

        if (ratingB !== ratingA) {
          return ratingB - ratingA;
        }

        return b._count.orderItems - a._count.orderItems;
      })
      .map((product) => this.mapProductToRecommendation(product));

    return {
      message: Messages.get(name),
      data: mappedProducts,
    };
  }

  async getRelatedRecommendations(
    productId?: string,
  ): Promise<WebResponse<ProductRecomendationRes[]>> {
    const targetProduct = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true },
    });

    const name = 'Related Recommendations';

    if (!targetProduct) {
      throw new NotFoundException(name);
    }

    let products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        id: {
          not: productId,
        },
        categoryId: targetProduct.categoryId,
      },
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
        productDiscounts: {
          where: {
            isActive: true,
          },
          include: {
            discounts: {
              select: {
                discountType: true,
                value: true,
              },
            },
          },
        },
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    });

    products = this.sortByRatingAndSales(products);

    if (products.length < 5) {
      const additionalProducts = await this.prisma.product.findMany({
        where: {
          isActive: true,
          id: {
            notIn: [productId!, ...products.map((p) => p.id)],
          },
        },
        include: {
          reviews: {
            select: {
              rating: true,
            },
          },
          productDiscounts: {
            where: {
              isActive: true,
            },
            include: {
              discounts: {
                select: {
                  discountType: true,
                  value: true,
                },
              },
            },
          },
          _count: {
            select: {
              orderItems: true,
            },
          },
        },
      });

      products = this.sortByRatingAndSales([
        ...products,
        ...additionalProducts,
      ]).slice(0, 5);
    } else {
      products = products.slice(0, 5);
    }

    if (products.length === 0) {
      throw new NotFoundException(name);
    }

    return {
      message: Messages.get(name),
      data: products.map((product) => this.mapProductToRecommendation(product)),
    };
  }
}
