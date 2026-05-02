import { Injectable } from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from 'src/common/prisma.module';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { RemoveFromCartDto } from './dto/remove-from-cart';
import { WebResponse } from 'src/common/common.interface';
import { Messages } from 'src/utils/message.helper';
import { PaginationDto } from 'src/common/common.dto';
import { NotFoundException } from 'src/exceptions';
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
    await this.user.findDetail(userId);
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
      .then(() => {
        this.logCartAction('add', userId, body.productId, body.quantity);
        return { message: Messages.create(this.name) };
      });
  }

  async removeFromCart(
    userId: string,
    body: RemoveFromCartDto,
  ): Promise<WebResponse> {
    await this.user.findDetail(userId);
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
      .then(() => {
        this.logCartAction('remove', userId, body.productId, body.quantity);
        return { message: Messages.create(this.name) };
      });
  }

  async findByUser(
    payload: JwtPayload,
    { limit, page }: PaginationDto,
  ): Promise<WebResponse<FindByUserDto>> {
    const skip = Math.max((page - 1) * limit, 0);
    const [data, total] = await Promise.all([
      this.prisma.cart.findFirstOrThrow({
        where: { id: payload.sub },
        select: {
          id: true,
          cartItems: {
            skip,
            take: limit,
            select: {
              id: true,
              quantity: true,
              products: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  categoryId: true,
                  imageUrl: true,
                  discountId: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.cartItem.count({
        where: { carts: { id: payload.sub } },
      }),
    ]);

    if (total <= 0) throw new NotFoundException(this.name);

    return {
      message: Messages.get('User'),
      data,
      paging: {
        currentPage: page,
        pageSize: limit,
        totalItems: total,
        totalPages: Math.ceil(total / (limit || 1)),
      },
    };

    //   return await Promise.all([
    //     this.prisma.cart.findUniqueOrThrow({
    //       where: { userId: sub },
    //       select: {
    //         id: true,
    //         userId: true,
    //         cartItems: {
    //           skip,
    //           take: limit,
    //           select: {
    //             id: true,
    //             productId: true,
    //             quantity: true,
    //             products: {
    //               select: {
    //                 id: true,
    //                 name: true,
    //                 price: true,
    //                 categories: {
    //                   select: {
    //                     id: true,
    //                     name: true,
    //                   },
    //                 },
    //                 imageUrl: true,
    //                 discountId: true,
    //               },
    //             },
    //           },
    //         },
    //       },
    //     }),
    //     this.prisma.cartItem.count({
    //       where: { carts: { userId: sub } },
    //     }),
    //   ]).then(([data, total]) => {
    //     if (total <= 0) throw new NotFoundException(this.name);
    //   });
  }
}
