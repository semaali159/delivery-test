import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaptainsModule } from '../Captain/Captain.module';
import { Order, OrderSchema } from './Order.schema';
import { OrdersController } from './Order.controller';
import { OrdersService } from './Order.service';
import { AssignmentService } from './Assignment.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CaptainsModule,         
  ],
  controllers: [OrdersController],
  providers: [OrdersService,AssignmentService],
  exports: [OrdersService,AssignmentService],
})
export class OrdersModule {}