import { ConflictException, Injectable } from '@nestjs/common';
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

  findOne(id: number) {
    return `This action returns a #${id} table`;
  }

  update(id: number, updateTableDto: UpdateTableDto) {
    return `This action updates a #${id} table`;
  }

  remove(id: number) {
    return `This action removes a #${id} table`;
  }
}
