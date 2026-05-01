import { Injectable, NotFoundException } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from '../../common/prisma.module';
import { Prisma } from '../../generated/prisma/client';
import { WebResponse } from 'src/common/common.interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { Messages } from 'src/utils/message.helper';
import { PaginationDto } from 'src/common/common.dto';
import { FindAllRoleDto, FindOneRoleDto } from './roles.interface';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(RolesService.name);
  }

  private omit: Prisma.RoleOmit = {
    createdAt: true,
    updatedAt: true,
  };

  private name = 'Role';
  async create(body: CreateRoleDto): Promise<WebResponse> {
    return await this.prisma.role.create({ data: body }).then(() => ({
      message: Messages.create(this.name),
    }));
  }

  async findAll({
    page,
    limit,
  }: PaginationDto): Promise<WebResponse<FindAllRoleDto>> {
    const skip = Math.max((page - 1) * limit, 0);
    return await Promise.all([
      this.prisma.role.findMany({
        skip,
        take: limit,
        omit: this.omit,
      }),
      this.prisma.role.count(),
    ]).then(([roles, total]) => {
      if (total === 0) throw new NotFoundException(this.name);
      return {
        message: Messages.get('Category'),
        data: roles,
        paging: {
          currentPage: page,
          totalItems: total,
          pageSize: limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    });
  }

  async findById(id: string): Promise<WebResponse<FindOneRoleDto>> {
    return {
      message: Messages.get(this.name),
      data: await this.prisma.role.findUniqueOrThrow({
        where: { id },
        omit: this.omit,
      }),
    };
  }

  async findByName(name: string): Promise<WebResponse<FindOneRoleDto>> {
    return {
      message: Messages.get(this.name),
      data: await this.prisma.role.findUniqueOrThrow({
        where: { name },
        omit: this.omit,
      }),
    };
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<WebResponse> {
    return await this.prisma.role
      .update({ where: { id }, data: updateRoleDto })
      .then(() => ({ message: Messages.update(this.name) }));
  }

  async remove(id: string): Promise<WebResponse> {
    return this.prisma.role
      .delete({ where: { id } })
      .then(() => ({ message: Messages.delete(this.name) }));
  }
}
