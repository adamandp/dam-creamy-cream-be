import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { RolesModule } from './model/roles/roles.module';

@Module({
  imports: [CommonModule, RolesModule],
})
export class AppModule {}
