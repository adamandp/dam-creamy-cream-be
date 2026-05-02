import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PaginationDto } from 'src/common/common.dto';
import { CookieRequest, WebResponse } from 'src/common/common.interface';
import { PrismaService } from 'src/common/prisma.module';
import { ErrorMessage, Messages } from 'src/utils/message.helper';
import { UsersService } from '../users/users.service';
import { NotFoundException, UnauthorizedException } from 'src/exceptions';
import {
  FindAllAddressResDto as FindAllDto,
  FindByIdAddressResDto as FindByIdDto,
  FindByUserAddressResDto as FindByUserDto,
  ValidateAddressResDto as ValidateDto,
} from './addresses.interface';
import { validateUpdate } from 'src/utils/validate-update';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';
import { JwtPayload } from '../session/session.interface';

@Injectable()
export class AddressesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly user: UsersService,
    private readonly jwt: JwtService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AddressesService.name);
  }

  private name = 'Address';

  async create(body: CreateAddressDto): Promise<WebResponse> {
    await this.user.validateUser(body.userId);
    return await this.prisma
      .$transaction(async (tx) => {
        const count = await tx.address.count({
          where: { userId: body.userId },
        });
        if (count === 0) body.isPrimary = true;
        if (body.isPrimary) {
          await tx.address.updateMany({
            where: { userId: body.userId, isPrimary: true },
            data: { isPrimary: false },
          });
        }
        await tx.address.create({ data: body });
      })
      .then(() => ({ statusCode: 201, message: Messages.create(this.name) }));
  }

  async findAll({
    limit,
    page,
  }: PaginationDto): Promise<WebResponse<FindAllDto>> {
    const skip = Math.max((page - 1) * limit, 0);
    return await Promise.all([
      this.prisma.address.findMany({
        skip,
        take: limit,
      }),
      this.prisma.address.count(),
    ]).then(([address, total]) => {
      if (!total) new NotFoundException(this.name);
      return {
        message: Messages.get(this.name),
        data: address,
        paging: {
          currentPage: page,
          pageSize: limit,
          totalItems: total,
          totalPages: Math.ceil(total / (limit || 1)),
        },
      };
    });
  }

  async validateAddress(id: string): Promise<WebResponse<ValidateDto>> {
    return await this.prisma.address
      .findUniqueOrThrow({ where: { id } })
      .then((address) => ({
        message: Messages.get(this.name),
        data: address,
      }));
  }

  async findById(id: string): Promise<WebResponse<FindByIdDto>> {
    return await this.prisma.address
      .findUniqueOrThrow({ where: { id } })
      .then((address) => ({
        message: Messages.get(this.name),
        data: address,
      }));
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
    return await this.prisma.address
      .findMany({ where: { userId: sub } })
      .then((address) => {
        if (address.length <= 0) new NotFoundException(this.name);
        return {
          message: Messages.get('User Address'),
          data: address,
        };
      });
  }

  async update(id: string, body: UpdateAddressDto): Promise<WebResponse> {
    const exsitingAddress = await this.validateAddress(id);
    return await this.prisma.address
      .update({
        where: { id },
        data: validateUpdate(body, exsitingAddress.data!),
      })
      .then(() => ({ message: Messages.update(this.name) }));
  }

  async remove(id: string): Promise<WebResponse> {
    const exisitingAddress = await this.validateAddress(id);
    return await this.prisma.$transaction(async (tx) => {
      const count = await tx.address.count({
        where: { userId: exisitingAddress.data!.userId },
      });
      if (count <= 1) throw new ConflictException(ErrorMessage.strictDelete);
      return await tx.address
        .delete({ where: { id } })
        .then(() => ({ message: Messages.delete(this.name) }));
    });
  }
}
