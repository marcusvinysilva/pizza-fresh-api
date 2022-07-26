import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TableModule } from './table/table.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [PrismaModule, TableModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
