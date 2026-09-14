import { Injectable } from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { PinoLogger } from 'nestjs-pino';
// import { PrismaService } from 'src/common/prisma.module';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { RemoveFromCartDto } from './dto/remove-from-cart';
import { WebResponse } from 'src/common/common.interface';
import { Messages } from 'src/utils/message.helper';
import { PaginationDto } from 'src/common/common.dto';
import { FindByUserCartDto as FindByUserDto } from './carts.interface';
import { JwtPayload } from '../session/session.interface';

@Injectable()
export class CartsService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly prisma: PrismaService,
    private readonly user: UsersService,
    private readonly product: ProductsService,
  ) {
    this.logger.setContext(CartsService.name);
  }

  private readonly name = 'Cart';

  private logCartAction(
    action: 'add' | 'remove',
    userId: string,
    productId: string,
    quantity: number,
  ) {
    const actionText = action === 'add' ? 'Added' : 'Removed';
    this.logger.trace(
      `${actionText} ${quantity} of product ${productId} ${action === 'add' ? 'to' : 'from'} cart for user ${userId}`,
    );
  }

  async addToCart(userId: string, body: AddToCartDto): Promise<WebResponse> {
    await this.user.validateUser(userId);
    await this.product.validateProduct(body.productId);
    return await this.prisma
      .$transaction(async (tx) => {
        const { id: cartId } = await tx.cart.findUniqueOrThrow({
          where: { userId },
          select: { id: true },
        });
        await tx.cartItem.upsert({
          where: {
            cartId_productId: {
              cartId,
              productId: body.productId,
            },
          },
          update: {
            quantity: {
              increment: body.quantity,
            },
          },
          create: {
            cartId,
            productId: body.productId,
            quantity: body.quantity,
          },
        });
      })
      .then((data) => {
        this.logCartAction('add', userId, body.productId, body.quantity);
        return { message: Messages.create(this.name), data: data };
      });
  }

  async removeFromCart(
    userId: string,
    body: RemoveFromCartDto,
  ): Promise<WebResponse> {
    await this.user.validateUser(userId);
    await this.product.validateProduct(body.productId);
    return await this.prisma
      .$transaction(async (tx) => {
        const { id: cartId } = await tx.cart.findUniqueOrThrow({
          where: { userId },
          select: { id: true },
        });
        const { id: cartItemId, quantity: exsitingQuantity } =
          await tx.cartItem.findUniqueOrThrow({
            where: {
              cartId_productId: {
                cartId,
                productId: body.productId,
              },
            },
            select: { id: true, quantity: true },
          });
        if (exsitingQuantity <= body.quantity) {
          await tx.cartItem.delete({ where: { id: cartItemId } });
        } else {
          await tx.cartItem.update({
            where: { id: cartItemId },
            data: { quantity: { decrement: body.quantity } },
          });
        }
      })
      .then((data) => {
        this.logCartAction('remove', userId, body.productId, body.quantity);
        return { message: Messages.delete(this.name), data };
      });
  }

  async findByUser(
    payload: JwtPayload,
    { limit, page }: PaginationDto,
  ): Promise<WebResponse<FindByUserDto[]>> {
    const skip = Math.max((page - 1) * limit, 0);

    const [cart, total] = await Promise.all([
      this.prisma.cart.findFirst({
        where: {
          userId: payload.sub,
        },
        select: {
          cartItems: {
            skip,
            take: limit,
            select: {
              quantity: true,
              products: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                  price: true,
                  categories: {
                    select: {
                      name: true,
                    },
                  },
                  productDiscounts: {
                    select: {
                      discounts: {
                        select: {
                          discountType: true,
                          value: true,
                          startDate: true,
                          endDate: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.cartItem.count({
        where: {
          carts: {
            userId: payload.sub,
          },
        },
      }),
    ]);

    if (!cart || total === 0) {
      return {
        message: Messages.get(this.name),
        data: [],
        paging: {
          currentPage: page,
          pageSize: limit,
          totalItems: 0,
          totalPages: 0,
        },
      };
    }

    const now = new Date();

    const items: FindByUserDto[] = cart.cartItems.map((item) => {
      const product = item.products;
      const discount = product.productDiscounts?.discounts;

      let discountPrice: number | null = null;

      if (
        discount &&
        discount.value !== null &&
        discount.startDate <= now &&
        discount.endDate >= now
      ) {
        switch (discount.discountType) {
          case 'PERCENTAGE':
            discountPrice =
              product.price - (product.price * discount.value) / 100;
            break;

          default:
            discountPrice = Math.max(product.price - discount.value, 0);
        }
      }

      return {
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        category: product.categories.name,
        price: product.price,
        discountPrice,
        qty: item.quantity,
      };
    });

    return {
      message: Messages.get('User Cart'),
      data: items,
      paging: {
        currentPage: page,
        pageSize: limit,
        totalItems: total,
        totalPages: Math.ceil(total / (limit || 1)),
      },
    };
  }
}
