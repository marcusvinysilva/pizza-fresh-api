import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const productExists = await this.prismaService.product.findUnique({
      where: { name: createProductDto.name },
    });

    if (productExists) {
      throw new ConflictException(
        'Produto com o mesmo nome já cadastrado, informe outro nome',
      );
    }

    return await this.prismaService.product.create({
      data: createProductDto,
    });
  }

  findAll(): Promise<Product[]> {
    return this.prismaService.product.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
