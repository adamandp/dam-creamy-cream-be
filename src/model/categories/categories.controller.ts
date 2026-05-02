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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from 'src/common/common.dto';
import { PinoLogger } from 'nestjs-pino';
import {
  FindAllCategoryDto as FindAllDto,
  FindByIdCategoryDto as FindByIdDto,
} from './categories.interface';
import { WebResponse } from 'src/common/common.interface';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly service: CategoriesService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CategoriesController.name);
  }

  @Post()
  create(@Body() body: CreateCategoryDto): Promise<WebResponse> {
    return this.service.create(body);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
  ): Promise<WebResponse<FindAllDto>> {
    return this.service.findAll(pagination);
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<WebResponse<FindByIdDto>> {
    return this.service.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateCategoryDto,
  ): Promise<WebResponse> {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<WebResponse> {
    return this.service.remove(id);
  }
}
