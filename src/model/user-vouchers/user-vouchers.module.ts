import { Module } from '@nestjs/common';
import { UserVouchersService } from './user-vouchers.service';
import { UserVouchersController } from './user-vouchers.controller';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { VouchersModule } from '../vouchers/vouchers.module';

@Module({
  imports: [UsersModule, VouchersModule],
  controllers: [UserVouchersController],
  providers: [UserVouchersService],
})
export class UserVouchersModule {}
