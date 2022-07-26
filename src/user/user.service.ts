import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.prismaService.user.findUnique({
      where: { nickname: createUserDto.nickname },
    });

    if (userExists) {
      throw new ConflictException(
        'Usuário já cadastrado, informe outro nickname',
      );
    }

    if (createUserDto.password !== createUserDto.passwordConfirm) {
      throw new ForbiddenException('Senhas não conferem');
    }

    delete createUserDto.passwordConfirm;

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const createdUser = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    delete createdUser.password;

    return createdUser;
  }

  async findAll(): Promise<User[]> {
    const userList = await this.prismaService.user.findMany();

    if (userList.length === 0) {
      throw new NotFoundException('Não há usuários cadastrados');
    }

    return userList;
  }

  async findOne(id: string): Promise<User> {
    const userExists = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      throw new NotFoundException(`Usuário ${id} não encontrado`);
    }

    return userExists;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
