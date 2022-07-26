import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTableDto {
  @IsPositive()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  number: number;
}
