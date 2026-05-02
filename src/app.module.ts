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
  ],
})
export class AppModule {}
