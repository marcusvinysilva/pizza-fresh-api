import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(data: LoginDto): Promise<LoginResponseDto> {
    const { nickname, password } = data;

    const userExists = await this.prismaService.user.findUnique({
      where: { nickname },
    });

    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const isHashValid = await bcrypt.compare(password, userExists.password);

    if (!isHashValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    delete userExists.password;

    return {
      token: this.jwtService.sign({ nickname }),
      user: userExists,
    };
  }
}
