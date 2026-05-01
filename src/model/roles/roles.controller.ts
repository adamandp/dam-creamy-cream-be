import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { WebResponse } from '../../common/common.interface';
import { PaginationDto } from '../../common/common.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { FindAllRoleDto, FindOneRoleDto } from './roles.interface';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() body: CreateRoleDto): Promise<WebResponse> {
    return this.rolesService.create(body);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
  ): Promise<WebResponse<FindAllRoleDto>> {
    return this.rolesService.findAll(pagination);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WebResponse<FindOneRoleDto>> {
    return this.rolesService.findById(id);
  }

  @Get('name/:name')
  findByName(
    @Param('name') name: string,
  ): Promise<WebResponse<FindOneRoleDto>> {
    return this.rolesService.findByName(name);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<WebResponse> {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<WebResponse> {
    return this.rolesService.remove(id);
  }
}
