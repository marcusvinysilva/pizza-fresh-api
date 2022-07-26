import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChangeItemOrderDto } from './dto/change-item-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { Status } from './entities/status.entity';

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

  async findAll() {
    const orderList = await this.prismaService.order.findMany({
      include: {
        user: true,
        products: true,
        table: true,
      },
    });

    if (orderList.length === 0) {
      throw new NotFoundException('Não há pedidos cadastrados');
    }

    return orderList;
  }

  async findOne(id: string) {
    const orderExists = await this.prismaService.order.findUnique({
      where: { id },
      include: {
        user: true,
        table: true,
        products: true,
      },
    });

    if (!orderExists) {
      throw new NotFoundException(`Pedido ${id} não encontrado`);
    }

    return orderExists;
  }

  private async canOrderBeProcessed(changeItemOrderDto: ChangeItemOrderDto) {
    const orderExists = await this.prismaService.order.findUnique({
      where: { id: changeItemOrderDto.orderId },
      include: {
        user: true,
        table: true,
        products: true,
      },
    });

    if (!orderExists) {
      throw new NotFoundException(
        `Pedido ${changeItemOrderDto.orderId} não encontrado`,
      );
    }

    if (changeItemOrderDto.productsId.length === 0) {
      throw new UnprocessableEntityException('Não há itens disponíveis.');
    }

    if (orderExists.status === Status.CLOSED) {
      throw new ForbiddenException('Pedido está fechado');
    }
  }

  async addItem(changeItemOrderDto: ChangeItemOrderDto) {
    await this.canOrderBeProcessed(changeItemOrderDto);

    const updatedOrder = await this.prismaService.order.update({
      where: { id: changeItemOrderDto.orderId },
      data: {
        products: {
          connect: changeItemOrderDto.productsId.map((item) => ({
            id: item,
          })),
        },
      },
      include: {
        products: true,
      },
    });

    let orderTotal = 0;

    updatedOrder.products.map((item) => {
      orderTotal += item.price;
    });

    return { updatedOrder, orderTotal };
  }

  async removeItem(changeItemOrderDto: ChangeItemOrderDto) {
    await this.canOrderBeProcessed(changeItemOrderDto);

    const updatedOrder = await this.prismaService.order.update({
      where: { id: changeItemOrderDto.orderId },
      data: {
        products: {
          disconnect: changeItemOrderDto.productsId.map((item) => ({
            id: item,
          })),
        },
      },
      include: {
        products: true,
      },
    });

    let orderTotal = 0;

    updatedOrder.products.map((item) => {
      orderTotal += item.price;
    });

    return { updatedOrder, orderTotal };
  }
}
