import { Injectable } from '@nestjs/common';
import { CreateUserVoucherDto } from './dto/create-user-voucher.dto';
import {
  ValidateUserVoucherDto as ValidateDto,
  FindByUserUserVoucherDto as FindByUserDto,
  FindByIdUserVoucherDto as FindByIdDto,
  FindAllUserVoucherDto as FindAllDto,
  FindByVoucherUserVoucherDto as FindByVoucherDto,
} from './user-vouchers.interface';
import { CookieRequest, WebResponse } from 'src/common/common.interface';
import { PrismaService } from 'src/common/prisma.module';
import { PinoLogger } from 'nestjs-pino';
import { PaginationDto } from 'src/common/common.dto';
import { Messages } from 'src/utils/message.helper';
import { NotFoundException, UnauthorizedException } from 'src/exceptions';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../session/session.interface';
import { UsersService } from '../users/users.service';
import { VouchersService } from '../vouchers/vouchers.service';
import { UserVoucherStatus } from 'src/generated/prisma/enums';

@Injectable()
export class UserVouchersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: PinoLogger,
    private readonly jwt: JwtService,
    private readonly user: UsersService,
    private readonly voucher: VouchersService,
  ) {
    this.logger.setContext(UserVouchersService.name);
  }

  private name = 'User Voucher';

  async create(body: CreateUserVoucherDto): Promise<WebResponse> {
    await this.user.validateUser(body.userId);
    await this.voucher.validateVoucher(body.voucherId);
    return await this.prisma.userVoucher
      .create({ data: body })
      .then(() => ({ message: Messages.create(this.name) }));
  }

  async findAll({
    limit,
    page,
  }: PaginationDto): Promise<WebResponse<FindAllDto>> {
    const skip = Math.max((page - 1) * limit, 0);
    return await Promise.all([
      this.prisma.userVoucher.findMany({
        skip,
        take: limit,
      }),
      this.prisma.userVoucher.count(),
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

  async validateUserVoucher(id: string): Promise<WebResponse<ValidateDto>> {
    return await this.prisma.userVoucher
      .findUniqueOrThrow({ where: { id } })
      .then((data) => ({ message: Messages.get(this.name), data }));
  }

  async findById(id: string): Promise<WebResponse<FindByIdDto>> {
    return await this.prisma.userVoucher
      .findUniqueOrThrow({ where: { id } })
      .then((data) => ({ message: Messages.get(this.name), data }));
  }

  async findByUser(
    request: CookieRequest,
  ): Promise<WebResponse<FindByUserDto>> {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
      throw new UnauthorizedException();
    const { sub }: JwtPayload = await this.jwt.decode(
      authHeader.replace('Bearer ', ''),
    );
    return await this.prisma.userVoucher
      .findMany({ where: { userId: sub }, include: { vouchers: true } })
      .then((data) => ({ message: Messages.get(this.name), data }));
  }

  async findByVoucher(id: string): Promise<WebResponse<FindByVoucherDto>> {
    return await this.prisma.userVoucher
      .findMany({ where: { voucherId: id } })
      .then((data) => ({ message: Messages.get(this.name), data }));
  }

  async use(id: string): Promise<WebResponse> {
    await this.validateUserVoucher(id);
    return await this.prisma.userVoucher
      .update({ where: { id }, data: { status: UserVoucherStatus.USED } })
      .then(() => ({ message: Messages.update(this.name) }));
  }
}
