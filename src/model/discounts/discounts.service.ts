import { Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { PrismaService } from 'src/common/prisma.module';
import { PinoLogger } from 'nestjs-pino';
import { WebResponse } from 'src/common/common.interface';
import { Messages } from 'src/utils/message.helper';
import { PaginationDto } from 'src/common/common.dto';
import {
  FindAllResDiscountDto as FindAllDto,
  FindByIdResDiscountDto as FindByIdDto,
  ValidateDiscountResDto as ValidateDto,
} from './discounts.interface';
import { NotFoundException } from 'src/exceptions';
import { validateUpdate } from 'src/utils/validate-update';

@Injectable()
export class DiscountsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(DiscountsService.name);
  }

  private name = 'Discount';

  async validateDiscount(id: string): Promise<WebResponse<ValidateDto>> {
    return await this.prisma.discount
      .findUniqueOrThrow({ where: { id } })
      .then((data) => ({ message: Messages.get(this.name), data }));
  }

  async create(body: CreateDiscountDto): Promise<WebResponse> {
    return await this.prisma.discount.create({ data: body }).then(() => ({
      message: Messages.create(this.name),
    }));
  }

  async findAll({
    limit,
    page,
  }: PaginationDto): Promise<WebResponse<FindAllDto>> {
    const skip = Math.max((page - 1) * limit, 0);
    return await Promise.all([
      this.prisma.discount.findMany({
        skip,
        take: limit,
      }),
      this.prisma.discount.count(),
    ]).then(([data, total]) => {
      if (total <= 0) throw new NotFoundException('Users');
      return {
        message: Messages.get('User'),
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
    return await this.prisma.discount
      .findUniqueOrThrow({ where: { id } })
      .then((data) => ({ message: Messages.get(this.name), data }));
  }

  async update(id: string, body: UpdateDiscountDto): Promise<WebResponse> {
    const exsitingDiscount = await this.validateDiscount(id);
    return await this.prisma.discount
      .update({
        where: { id },
        data: validateUpdate(body, exsitingDiscount.data!),
      })
      .then(() => ({ message: Messages.update(this.name) }));
  }

  async remove(id: string): Promise<WebResponse> {
    await this.validateDiscount(id);
    return await this.prisma.discount
      .delete({
        where: { id },
      })
      .then(() => ({ message: Messages.delete(this.name) }));
  }
}
