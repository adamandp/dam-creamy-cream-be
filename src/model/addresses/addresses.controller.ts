import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  Request,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PaginationDto } from 'src/common/common.dto';
import type { CookieRequest, WebResponse } from 'src/common/common.interface';
import {
  FindAllAddressResDto as FindAllDto,
  FindByIdAddressResDto as FindByIdDto,
  FindByUserAddressResDto as FindByUserDto,
} from './addresses.interface';
import { PinoLogger } from 'nestjs-pino';

@Controller('addresses')
export class AddressesController {
  constructor(
    private readonly addressesService: AddressesService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AddressesController.name);
  }

  @Post()
  create(@Body() createAddressDto: CreateAddressDto): Promise<WebResponse> {
    return this.addressesService.create(createAddressDto);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
  ): Promise<WebResponse<FindAllDto>> {
    return this.addressesService.findAll(pagination);
  }

  @Get(':id')
  findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WebResponse<FindByIdDto>> {
    return this.addressesService.findById(id);
  }

  @Get('user/:id')
  findByUserId(
    @Request() request: CookieRequest,
  ): Promise<WebResponse<FindByUserDto>> {
    return this.addressesService.findByUser(request);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<WebResponse> {
    return this.addressesService.update(id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<WebResponse> {
    return this.addressesService.remove(id);
  }
}
