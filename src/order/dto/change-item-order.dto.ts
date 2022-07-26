import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ChangeItemOrderDto {
  @IsUUID()
  @ApiProperty({
    description: 'ID do pedido que está sendo atualizado',
    example: 'e1bc0c89-a319-44df-a6e9-db66fe7b956b',
  })
  orderId: string;

  @IsUUID(undefined, { each: true })
  @ApiProperty({
    description: 'Lista com os IDs dos produtos que estão no pedido',
    example:
      '["04f66779-bcfa-4c5c-a140-f234138890f3", "adb96fd7-cdcf-43dc-9e1b-0c0a262111f9"]',
  })
  productsId: string[];
}
