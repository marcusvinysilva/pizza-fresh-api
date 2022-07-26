import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    description: 'Nome de usuário. Utilizado no login. Deve ser único',
    example: 'marcusvinysilva',
  })
  nickname: string;

  @IsString()
  @ApiProperty({
    description: 'Nome do usuário. Apenas para exibição',
    example: 'Marcus Silva',
  })
  name: string;

  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Senha muito fraca',
  })
  @ApiProperty({
    description: 'Senha do usuário para login',
    example: 'Abcd@1234',
  })
  password: string;

  @ApiProperty({
    description: 'A confirmação da senha deve ser igual a senha',
    example: 'Abcd@1234',
  })
  passwordConfirm: string;

  @IsUrl()
  @ApiProperty({
    description: 'Imagem de perfil do usuário',
    example: 'https://avatars.githubusercontent.com/u/71359413?v=4',
  })
  image: string;
}
