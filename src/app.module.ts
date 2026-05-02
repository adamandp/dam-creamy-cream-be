import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { RolesModule } from './model/roles/roles.module';
import { UsersModule } from './model/users/users.module';
import { SessionModule } from './model/session/session.module';
import { AddressesModule } from './model/addresses/addresses.module';
import { NotificationsModule } from './model/notifications/notifications.module';
import { UserNotificationsModule } from './model/user-notifications/user-notifications.module';
import { CategoriesModule } from './model/categories/categories.module';
import { ProductsModule } from './model/products/products.module';
import { CartsModule } from './model/carts/carts.module';
import { DiscountsModule } from './model/discounts/discounts.module';
import { HealthModule } from './model/health/health.module';
import { InventoryModule } from './model/inventory/inventory.module';
import { ProductAnalyticsModule } from './model/product-analytics/product-analytics.module';
import { ProductDiscountsModule } from './model/product-discounts/product-discounts.module';
import { VouchersModule } from './model/vouchers/vouchers.module';
import { UserVouchersModule } from './model/user-vouchers/user-vouchers.module';
import { ReviewsModule } from './model/reviews/reviews.module';
import { ShipmentsModule } from './model/shipments/shipments.module';
import { OrdersModule } from './model/orders/orders.module';
import { PaymentsModule } from './model/payments/payments.module';

@Module({
  imports: [
    CommonModule,
    RolesModule,
    UsersModule,
    SessionModule,
    AddressesModule,
    NotificationsModule,
    UserNotificationsModule,
    CategoriesModule,
    ProductsModule,
    CartsModule,
    DiscountsModule,
    HealthModule,
    InventoryModule,
    ProductAnalyticsModule,
    ProductDiscountsModule,
    VouchersModule,
    UserVouchersModule,
    ReviewsModule,
    ShipmentsModule,
    OrdersModule,
    PaymentsModule,
  ],
})
export class AppModule {}
