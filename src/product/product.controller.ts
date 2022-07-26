import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Product } from './entities/product.entity';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um produto',
  })
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os produtos',
  })
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Listar um produto por seu ID',
  })
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar um produto por seu ID',
  })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
