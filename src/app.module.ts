import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TableModule } from './table/table.module';

@Module({
  imports: [PrismaModule, TableModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
