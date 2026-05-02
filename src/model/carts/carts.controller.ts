import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
  Request,
} from '@nestjs/common';
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

  @Post('add/:id')
  async addToCart(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: AddToCartDto,
  ): Promise<WebResponse> {
    return this.cartsService.addToCart(id, body);
  }

  @Post('remove/:id')
  async removeFromCart(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: AddToCartDto,
  ): Promise<WebResponse> {
    return this.cartsService.removeFromCart(id, body);
  }

  @Get('/user')
  findByUser(
    @CurrentUser() payload: JwtPayload,
    @Query() pagination: PaginationDto,
  ): Promise<WebResponse<FindByUserDto>> {
    this.logger.trace(`Fetching cart for user ${payload.sub}`);
    return this.cartsService.findByUser(payload, pagination);
  }
}
