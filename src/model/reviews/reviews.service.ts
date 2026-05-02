import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/common/prisma.module';
import { PinoLogger } from 'nestjs-pino';
import { CookieRequest, WebResponse } from 'src/common/common.interface';
import { Messages } from 'src/utils/message.helper';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ProductsService } from '../products/products.service';
import { PaginationDto } from 'src/common/common.dto';
import { NotFoundException, UnauthorizedException } from 'src/exceptions';
import {
  ValidateReviewResDto as ValidateDto,
  FindAllReviewResDto as FindAllDto,
  FindByIdReviewResDto as FindByIdDto,
  FindByProductReviewResDto as FindByProductDto,
  FindByUserReviewResDto as FindByUserDto,
} from './reviews.interface';
import { validateUpdate } from 'src/utils/validate-update';
import { JwtPayload } from '../session/session.interface';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: PinoLogger,
    private readonly user: UsersService,
    private readonly product: ProductsService,
    private readonly jwt: JwtService,
  ) {
    this.logger.setContext(ReviewsService.name);
  }

  private name = 'Review';

  async validateReview(id: string): Promise<WebResponse<ValidateDto>> {
    return await this.prisma.review
      .findUniqueOrThrow({
        where: { id },
      })
      .then((data) => ({ message: Messages.get(this.name), data }));
  }

  async create(body: CreateReviewDto): Promise<WebResponse> {
    await this.user.validateUser(body.userId);
    await this.product.validateProduct(body.productId);
    return this.prisma.review
      .create({ data: body })
      .then(() => ({ message: Messages.create(this.name) }));
  }

  async findAll({
    limit,
    page,
  }: PaginationDto): Promise<WebResponse<FindAllDto>> {
    const skip = Math.max((page - 1) * limit, 0);
    return await Promise.all([
      this.prisma.review.findMany({
        skip,
        take: limit,
      }),
      this.prisma.review.count(),
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
    return await this.prisma.review
      .findUniqueOrThrow({
        where: { id },
      })
      .then((data) => ({ message: Messages.get(this.name), data }));
  }

  async findByUser(
    request: CookieRequest,
    { limit, page }: PaginationDto,
  ): Promise<WebResponse<FindByUserDto>> {
    const skip = Math.max((page - 1) * limit, 0);
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
      throw new UnauthorizedException();
    const { sub }: JwtPayload = await this.jwt.decode(
      authHeader.replace('Bearer ', ''),
    );
    await this.user.validateUser(sub);
    return await Promise.all([
      this.prisma.review.findMany({
        where: { userId: sub },
        skip,
        take: limit,
      }),
      this.prisma.review.count(),
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

  async findByProduct(
    productId: string,
    { limit, page }: PaginationDto,
  ): Promise<WebResponse<FindByProductDto>> {
    const skip = Math.max((page - 1) * limit, 0);
    await this.product.validateProduct(productId);
    return await Promise.all([
      this.prisma.review.findMany({
        where: { productId },
        skip,
        take: limit,
      }),
      this.prisma.review.count(),
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

  async update(id: string, body: UpdateReviewDto): Promise<WebResponse> {
    const exsitingReview = await this.validateReview(id);
    return this.prisma.review
      .update({
        where: { id },
        data: validateUpdate(body, exsitingReview.data!),
      })
      .then(() => ({ message: Messages.update(this.name) }));
  }

  async remove(id: string): Promise<WebResponse> {
    await this.validateReview(id);
    return this.prisma.review
      .delete({ where: { id } })
      .then(() => ({ message: Messages.delete(this.name) }));
  }
}
