import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/common/prisma.module';
import { WebResponse } from 'src/common/common.interface';
import { Messages } from 'src/utils/message.helper';
import { PaginationDto } from 'src/common/common.dto';
import { NotFoundException } from 'src/exceptions';
import { validateUpdate } from 'src/utils/validate-update';
import {
  ValidateCategoryDto as ValidateDto,
  FindAllCategoryDto as FindAllDto,
  FindByIdCategoryDto as FindByIdDto,
} from './categories.interface';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private name = 'category';

  async validateCategory(id: string): Promise<WebResponse<ValidateDto>> {
    return await this.prisma.category
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .then((data) => ({
        message: Messages.get(this.name),
        data,
      }));
  }

  async create(body: CreateCategoryDto): Promise<WebResponse> {
    return await this.prisma.category
      .create({ data: body })
      .then(() => ({ message: Messages.create(this.name) }));
  }

  async findAll({
    limit,
    page,
  }: PaginationDto): Promise<WebResponse<FindAllDto>> {
    const skip = Math.max((page - 1) * limit, 0);
    return await Promise.all([
      this.prisma.category.findMany({
        skip,
        take: limit,
      }),
      this.prisma.category.count(),
    ]).then(([data, total]) => {
      if (total <= 0) throw new NotFoundException(this.name);
      return {
        message: Messages.get(this.name),
        data,
        paging: {
          currentPage: page,
          pageSize: limit,
          totalItems: total,
          totalPages: Math.ceil(total / (limit || 1)),
        },
      };
    });
  }

  async findById(id: string): Promise<WebResponse<FindByIdDto>> {
    return await this.prisma.category
      .findUniqueOrThrow({ where: { id } })
      .then((category) => ({
        message: Messages.get(this.name),
        data: category,
      }));
  }

  async update(id: string, body: UpdateCategoryDto): Promise<WebResponse> {
    const exsitingCategory = await this.findById(id);
    return await this.prisma.category
      .update({
        where: { id },
        data: validateUpdate(body, exsitingCategory.data!),
      })
      .then(() => ({ message: Messages.update(this.name) }));
  }

  async remove(id: string): Promise<WebResponse> {
    return await this.prisma.category
      .delete({ where: { id } })
      .then(() => ({ message: Messages.delete(this.name) }));
  }
}
