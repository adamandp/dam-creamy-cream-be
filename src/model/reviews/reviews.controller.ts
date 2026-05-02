import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import type { CookieRequest, WebResponse } from 'src/common/common.interface';
import {
  FindAllReviewResDto as FindAllDto,
  FindByIdReviewResDto as FindByIdDto,
  FindByProductReviewResDto as FindByProductDto,
  FindByUserReviewResDto as FindByUserDto,
} from './reviews.interface';
import { PaginationDto } from 'src/common/common.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() body: CreateReviewDto): Promise<WebResponse> {
    return this.reviewsService.create(body);
  }

  @Get()
  findAll(pagination: PaginationDto): Promise<WebResponse<FindAllDto>> {
    return this.reviewsService.findAll(pagination);
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<WebResponse<FindByIdDto>> {
    return this.reviewsService.findById(id);
  }

  @Get('me')
  findByUser(
    request: CookieRequest,
    pagination: PaginationDto,
  ): Promise<WebResponse<FindByUserDto>> {
    return this.reviewsService.findByUser(request, pagination);
  }

  @Get('product/:id')
  findByProduct(
    @Param('id') id: string,
    pagination: PaginationDto,
  ): Promise<WebResponse<FindByProductDto>> {
    return this.reviewsService.findByProduct(id, pagination);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<WebResponse> {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
