import { Controller, Get, Post, Body, Query, Request } from '@nestjs/common';
import { CartsService } from './carts.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { PaginationDto } from 'src/common/common.dto';
import { WebResponse } from 'src/common/common.interface';
import { FindByUserCartDto as FindByUserDto } from './carts.interface';
import { PinoLogger } from 'nestjs-pino';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { JwtPayload } from '../session/session.interface';

@Controller('carts')
export class CartsController {
  constructor(
    private readonly cartsService: CartsService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CartsController.name);
  }

  @Post('/user/add')
  async addToCart(
    @CurrentUser() payload: JwtPayload,
    @Body() body: AddToCartDto,
  ): Promise<WebResponse> {
    return this.cartsService.addToCart(payload.sub, body);
  }

  @Post('/user/remove')
  async removeFromCart(
    @CurrentUser() payload: JwtPayload,
    @Body() body: AddToCartDto,
  ): Promise<WebResponse> {
    return this.cartsService.removeFromCart(payload.sub, body);
  }

  @Get('/user')
  findByUser(
    @CurrentUser() payload: JwtPayload,
    @Query() pagination: PaginationDto,
  ): Promise<WebResponse<FindByUserDto[]>> {
    return this.cartsService.findByUser(payload, pagination);
  }
}
