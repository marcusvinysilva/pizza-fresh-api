import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTableDto {
  @IsPositive()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'O número da mesa',
    example: 1,
  })
  number: number;
}
