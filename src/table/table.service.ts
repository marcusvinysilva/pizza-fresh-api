import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { Table } from './entities/table.entity';

@Injectable()
export class TableService {
  constructor(private prismaService: PrismaService) {}

  async create(createTableDto: CreateTableDto): Promise<Table> {
    const tableExists = await this.prismaService.table.findUnique({
      where: { number: createTableDto.number },
    });

    if (tableExists) {
      throw new ConflictException('Mesa já cadastrada, informe outro número');
    }

    return await this.prismaService.table.create({
      data: createTableDto,
    });
  }

  findAll(): Promise<Table[]> {
    return this.prismaService.table.findMany();
  }

  async findOne(id: string): Promise<Table> {
    const tableExists = await this.prismaService.table.findUnique({
      where: { id },
    });

    if (!tableExists) {
      throw new NotFoundException(`Mesa ${id} não encontrada`);
    }

    return tableExists;
  }

  async update(id: string, updateTableDto: UpdateTableDto): Promise<Table> {
    const tableIdExists = await this.prismaService.table.findUnique({
      where: { id },
    });

    if (!tableIdExists) {
      throw new NotFoundException(
        `Mesa ${updateTableDto.number} não encontrada`,
      );
    }

    if (!updateTableDto.number) {
      throw new UnprocessableEntityException(
        'Número não informado, nenhuma alteração realizada',
      );
    }

    const tableNumberExists = await this.prismaService.table.findUnique({
      where: { number: updateTableDto.number },
    });

    if (!tableNumberExists) {
      return await this.prismaService.table.update({
        data: { number: updateTableDto.number },
        where: { id },
      });
    } else {
      throw new UnprocessableEntityException(
        'Já existe uma mesa com esse número, nenhuma alteração realizada',
      );
    }
  }

  async remove(id: string): Promise<Table> {
    const tableExists = await this.prismaService.table.findUnique({
      where: { id },
    });

    if (!tableExists) {
      throw new NotFoundException(`Mesa ${id} não encontrada`);
    }

    return await this.prismaService.table.delete({
      where: { id },
    });
  }
}
