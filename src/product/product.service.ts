import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
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

  async findOne(id: string): Promise<Product> {
    const productExists = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!productExists) {
      throw new ConflictException(`Produto ${id} não encontrado`);
    }

    return productExists;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const productIdExists = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!productIdExists) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }

    const productNameExists = await this.prismaService.product.findUnique({
      where: { name: updateProductDto.name },
    });

    if (!productNameExists) {
      return await this.prismaService.product.update({
        data: {
          name: updateProductDto.name,
          description: updateProductDto.description,
          image: updateProductDto.image,
          price: updateProductDto.price,
        },
        where: { id },
      });
    } else {
      throw new UnprocessableEntityException(
        'Já existe um produto com esse nome, nenhuma alteração realizada',
      );
    }
  }

  async remove(id: string): Promise<Product> {
    const productExists = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!productExists) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }

    return await this.prismaService.product.delete({
      where: { id },
    });
  }
}
