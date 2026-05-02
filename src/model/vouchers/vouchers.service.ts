import { Injectable } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { PrismaService } from 'src/common/prisma.module';
import { PinoLogger } from 'nestjs-pino';
import { WebResponse } from 'src/common/common.interface';
import { Messages } from 'src/utils/message.helper';
import {
  ValidateVoucherDto as ValidateDto,
  FindAllVoucherDto as FindAllDto,
  FindByIdVoucherDto as FindByIdDto,
} from './vouchers.interface';
import { PaginationDto } from 'src/common/common.dto';
import { NotFoundException } from 'src/exceptions';
import { ProductsService } from '../products/products.service';
import { validateUpdate } from 'src/utils/validate-update';

@Injectable()
export class VouchersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: PinoLogger,
    private readonly product: ProductsService,
  ) {
    this.logger.setContext(VouchersService.name);
  }

  private name = 'Voucher';

  async validateVoucher(id: string): Promise<WebResponse<ValidateDto>> {
    return await this.prisma.voucher
      .findUniqueOrThrow({ where: { id } })
      .then((data) => ({ message: Messages.get(this.name), data }));
  }

  async create(body: CreateVoucherDto): Promise<WebResponse> {
    return await this.prisma.voucher
      .create({ data: body })
      .then(() => ({ message: Messages.create(this.name) }));
  }

  async findAll({
    limit,
    page,
  }: PaginationDto): Promise<WebResponse<FindAllDto>> {
    const skip = Math.max((page - 1) * limit, 0);
    return await Promise.all([
      this.prisma.voucher.findMany({
        skip,
        take: limit,
      }),
      this.prisma.voucher.count(),
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
    return await this.prisma.voucher
      .findUniqueOrThrow({ where: { id } })
      .then((data) => ({ message: Messages.get(this.name), data }));
  }

  async update(id: string, body: UpdateVoucherDto): Promise<WebResponse> {
    const exsitingData = await this.validateVoucher(id);
    if (body.productId) await this.product.validateProduct(body.productId);
    return await this.prisma.voucher
      .update({ where: { id }, data: validateUpdate(body, exsitingData.data!) })
      .then(() => ({ message: Messages.update(this.name) }));
  }

  async remove(id: string): Promise<WebResponse> {
    return await this.prisma.voucher
      .update({ where: { id }, data: { isActive: false } })
      .then(() => ({ message: Messages.delete(this.name) }));
  }
}
