import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RolesModule } from '../roles/roles.module';
import { UploadService } from 'src/common/upload.service';

@Module({
  imports: [RolesModule],
  controllers: [UsersController],
  providers: [UsersService, UploadService],
})
export class UsersModule {}
