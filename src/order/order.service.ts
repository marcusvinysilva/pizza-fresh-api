import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const userIdExists = await this.prismaService.user.findUnique({
      where: { id: createOrderDto.userId },
      include: { orders: true },
    });

    const tableNicknameExists = await this.prismaService.table.findUnique({
      where: { number: createOrderDto.tableNumber },
      include: { orders: true },
    });

    if (!userIdExists || !tableNicknameExists) {
      throw new NotFoundException('Usuário ou mesa não existem');
    }

    if (tableNicknameExists.orders.length > 0) {
      throw new ForbiddenException('Já existe um pedido aberto para a mesa');
    }

    return this.prismaService.order.create({
      data: {
        table: {
          connect: {
            id: tableNicknameExists.id,
          },
        },
        user: {
          connect: {
            id: userIdExists.id,
          },
        },
      },
    });
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }
}
