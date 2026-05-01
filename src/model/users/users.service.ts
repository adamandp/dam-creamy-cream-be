import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.module';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from 'src/exceptions';
import { CreateUserDto } from './dto/create-user.dto';
import { Messages } from 'src/utils/message.helper';
import { UpdateUserDto } from './dto/update-user.dto';
import { validateUpdate } from 'src/utils/validate-update';
import { PinoLogger } from 'nestjs-pino';
import { UploadService } from 'src/common/upload.service';
import { WebResponse } from 'src/common/common.interface';
import { PaginationDto } from 'src/common/common.dto';
import {
  ValidateUserResDto as ValidateDto,
  FindAllUserResDto as FindAllDto,
  FindDetailResDto as FindDetailDto,
  FindProfileUserDto as FindProfileDto,
  FindOneUserDto as FindOneDto,
} from './users.interface';
import { RolesService } from '../roles/roles.service';
import { UpdateUserPasswordDto } from './dto/update-user-password';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../session/session.interface';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private logger: PinoLogger,
    private upload: UploadService,
    private roles: RolesService,
    private jwt: JwtService,
  ) {
    this.logger.setContext(UsersService.name);
  }

  private name = 'User';

  private userOmit: Prisma.UserOmit = {
    password: true,
  };

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10).catch(() => {
      this.logger.error('Failed to hash password');
      throw new InternalServerErrorException();
    });
  }

  private async validateDuplicate(
    username?: string,
    email?: string | null,
    phoneNumber?: string | null,
  ) {
    const conditions: Prisma.UserWhereInput[] = [];

    if (username) conditions.push({ username });
    if (email) conditions.push({ email });
    if (phoneNumber) conditions.push({ phoneNumber });

    if (conditions.length === 0) return;

    const user = await this.prisma.user.findFirst({
      where: {
        OR: conditions,
      },
    });

    if (!user) return;

    if (username && user.username === username)
      throw new ConflictException('username');
    if (email && user.email === email) throw new ConflictException('email');
    if (phoneNumber && user.phoneNumber === phoneNumber)
      throw new ConflictException('phoneNumber');
  }

  async validateUser(id: string): Promise<WebResponse<ValidateDto>> {
    return this.prisma.user
      .findUniqueOrThrow({
        where: { id },
        omit: { password: true },
      })
      .then((data) => ({ message: Messages.get(this.name), data }));
  }

  async create(body: CreateUserDto): Promise<WebResponse> {
    const { password, roleId, ...data } = body;
    await this.roles.findById(roleId);
    await this.validateDuplicate(data.username, data.email, data.phoneNumber);

    return await this.prisma.user
      .create({
        data: {
          ...data,
          password: await this.hashPassword(password),
          roles: { connect: { id: roleId } },
          cart: { create: {} },
        },
      })
      .then(() => ({ message: Messages.create(this.name) }));
  }

  async findAll({
    limit,
    page,
  }: PaginationDto): Promise<WebResponse<FindAllDto>> {
    const skip = Math.max((page - 1) * limit, 0);
    return await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        omit: this.userOmit,
      }),
      this.prisma.user.count(),
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

  async findProfile(request: Request): Promise<WebResponse<FindProfileDto>> {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
      throw new UnauthorizedException();
    const { sub }: JwtPayload = await this.jwt.decode(
      authHeader.replace('Bearer ', ''),
    );
    return await this.prisma.user
      .findUniqueOrThrow({
        where: { id: sub },
        omit: {
          id: true,
          roleId: true,
          password: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      .then((user) => ({ message: Messages.get(this.name), data: user }));
  }

  async findDetail(identifier: string): Promise<WebResponse<FindDetailDto>> {
    return await this.prisma.user
      .findFirstOrThrow({
        where: {
          OR: [
            { username: identifier },
            { email: identifier },
            { phoneNumber: identifier },
          ],
        },
        select: { id: true, password: true, roleId: true, username: true },
      })
      .then((data) => ({ message: Messages.get(this.name), data }));
  }

  async findOne(id: string): Promise<WebResponse<FindOneDto>> {
    return await this.prisma.user
      .findFirstOrThrow({
        where: { id },
        omit: { password: true },
      })
      .then((data) => ({ message: Messages.get(this.name), data }));
  }

  async update(id: string, body: UpdateUserDto): Promise<WebResponse> {
    if (body?.roleId) await this.roles.findById(body.roleId);
    await this.validateDuplicate(body.username, body?.email, body?.phoneNumber);

    const exsitingUser = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      omit: {
        id: true,
        password: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const updatedField = validateUpdate(body, exsitingUser);

    if (body?.roleId) {
      delete updatedField.roleId;
      updatedField.roles = { connect: { id: body.roleId } };
    }

    return this.prisma.user
      .update({
        where: { id },
        data: updatedField,
      })
      .then(() => ({ message: Messages.update(this.name) }));
  }

  async updatePassword(
    id: string,
    { exsitingPassword, newPassword }: UpdateUserPasswordDto,
  ): Promise<WebResponse> {
    const exsitingUser = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: { password: true },
    });
    if (!bcrypt.compareSync(exsitingPassword, exsitingUser.password))
      throw new BadRequestException(
        `🔐 Existing password is incorrect. Please try again with the correct one! 🙅‍♂️`,
      );
    if (bcrypt.compareSync(newPassword, exsitingUser.password))
      throw new BadRequestException(
        `🔁 New password can't be the same as your current password. Try something different! 😉`,
      );
    return await this.prisma.user
      .update({
        where: { id },
        data: {
          password: await this.hashPassword(newPassword),
        },
      })
      .then(() => ({ message: Messages.update('User Password') }));
  }

  async updateImage(
    id: string,
    file: Express.Multer.File,
  ): Promise<WebResponse> {
    const { imageUrl } = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: { imageUrl: true },
    });
    if (imageUrl !== null) await this.upload.deleteImage(id);
    return await this.prisma.user
      .update({
        where: { id },
        data: {
          imageUrl: (await this.upload.uploadImage(file, id)).secure_url,
        },
      })
      .then(() => ({ message: Messages.update('User Image') }));
  }

  async remove(id: string): Promise<WebResponse> {
    return this.prisma.user
      .delete({ where: { id } })
      .then(() => ({ message: Messages.delete(this.name) }));
  }
}
