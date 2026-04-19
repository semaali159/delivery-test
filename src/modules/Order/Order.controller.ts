import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrdersService } from './Order.service';
import { CreateOrderDto } from './dtos/Oreder-Create.dto';
import { AssignCaptainDto } from './dtos/Order-Assigne.dto';
import { UpdateOrderDto } from './dtos/Order-Update.dto';
import { AssignmentService } from './Assignment.service';
import { OrderQueryDto } from './dtos/Order-Query.dto';
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly assignmentService: AssignmentService
) {}

  @Post()
  @ApiOperation({ summary: 'Create new order' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAllAdvanced(@Query() query: OrderQueryDto) {
    return this.ordersService.findAllAdvanced(query);}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  // Assignment Endpoints
  @Post(':id/assign')
  assignCaptain(@Param('id') id: string, @Body() assignDto: AssignCaptainDto) {
    return this.assignmentService.assign(id, assignDto);
  }

  @Post(':id/unassign')
  unassignCaptain(@Param('id') id: string) {
    return this.assignmentService.unassign(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }
}