import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule, UsersModule],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
