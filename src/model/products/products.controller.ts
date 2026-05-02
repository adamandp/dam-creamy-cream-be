import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from 'src/common/common.dto';
import { multerOptions } from 'src/config/multer.config';
import { WebResponse } from 'src/common/common.interface';
import {
  FindAllProductResDto as FindAllDto,
  FindCatalogProductResDto as FindCatalogDto,
} from './products.interface';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() body: CreateProductDto): Promise<WebResponse> {
    return this.productsService.create(body);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
  ): Promise<WebResponse<FindAllDto>> {
    return this.productsService.findAll(pagination);
  }

  @Get('catalog')
  findCatalog(
    @Query() pagination: PaginationDto,
  ): Promise<WebResponse<FindCatalogDto[]>> {
    return this.productsService.findCatalog(pagination);
  }

  // @Get('catalog')
  // findCatalog(@Query() pagination: PaginationDto): Promise<WebResponse> {
  //   return this.productsService.findCatalog(pagination);
  // }

  @Get(':id')
  findDetail(@Param('id') id: string): Promise<WebResponse> {
    return this.productsService.findDetail(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<WebResponse> {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(':id/image')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  updateImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<WebResponse> {
    return this.productsService.updateImage(id, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<WebResponse> {
    return this.productsService.remove(id);
  }
}
