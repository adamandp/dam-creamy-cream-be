import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { RolesModule } from './model/roles/roles.module';
import { UsersModule } from './model/users/users.module';
import { SessionModule } from './model/session/session.module';

@Module({
  imports: [CommonModule, RolesModule, UsersModule, SessionModule],
})
export class AppModule {}
